#!/usr/bin/env python3
"""Build data.js for the Productive Farming field guide.

Reads an *unpacked* Productive Farming jar, a checkout of the mod's source
(only FarmingRegistrator.java is parsed, for crop groupings and flower base
colours) and an unpacked All the Mods 11 pack, then writes a single data file.

Nothing from the mod is copied verbatim into the output except names and
numbers: no textures, models or code are read or copied.

usage: build_data.py <unpacked-jar> <mod-source> <unpacked-pack> <out.js>
"""
import json
import os
import re
import sys

MOD = "productivefarming"


def load(path):
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


# --- source parsing --------------------------------------------------------
FOODS = {
    "Foods.POTATO": [1, 0.3], "Foods.CARROT": [3, 0.6], "Foods.BEETROOT": [1, 0.6],
    "Foods.SWEET_BERRIES": [2, 0.1], "Foods.MELON_SLICE": [2, 0.3], "Foods.APPLE": [4, 0.3],
    "LEAFY": [1, 0.0], "BERRY_FOOD": [1, 0.1],
}
SUPPLIER_FORM = {
    "GrainCropBlock": "grain", "DoubleCropBlock": "tall", "WaterCropBlock": "water",
    "TrellisLeafBlock": "trellis", "VerticalTrellisLeafBlock": "climber", "VineLeafBlock": "vine",
    "HerbBlock": "herb", "BerryBushBlock": "bush", "MushroomGrowthBlock": "shroom",
}
LIST_FORM = {"STEMS": "melon"}


def parse_registrator(path):
    crops, flowers = [], []
    current = None
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            m = re.search(r"public static (?:final )?List<\w+> (\w+)", line)
            if m:
                current = m.group(1)
                continue
            m = re.search(r"add\(new (\w+)\((.*)\)\);", line.strip())
            if not m or not current:
                continue
            kind, args = m.group(1), [a.strip() for a in m.group(2).split(",")]
            if kind == "CropConfig":
                form = LIST_FORM.get(current, "field")
                for arg in args[3:]:
                    sup = arg.split("::")[0]
                    form = SUPPLIER_FORM.get(sup, form)
                crops.append({
                    "id": args[0].strip('"'), "seed": args[1] == "true",
                    "food": FOODS.get(args[2]), "form": form, "list": current,
                })
            elif kind == "FlowerConfig":
                flowers.append({
                    "id": args[0].strip('"'), "color": "#" + args[1][-6:].lower(),
                    "tall": args[2] == "true", "vine": current == "VINES",
                })
    return crops, flowers


VANILLA_DYES = {
    -6447721: "Light Gray", -12103854: "Gray", -393218: "White", -3715395: "Magenta",
    -14869215: "Black", -8337633: "Lime", -425955: "Orange", -12930086: "Light Blue",
    -816214: "Pink", -8170446: "Brown", -10585066: "Green", -15295332: "Cyan",
    -12827478: "Blue", -7785800: "Purple", -47808: "Red", -75715: "Yellow",
}
DYENAMICS_DYES = {
    -2997991: "Persimmon", -19386: "Honey", -13861505: "Aquamarine", -560698: "Bubblegum",
    -16672561: "Cherenkov", -7345409: "Icy Blue", -4220813: "Peach", -1119818: "Fluorescent",
    -4531627: "Conifer", -9298341: "Wine", -11122177: "Ultramarine", -55195: "Rose",
    -7739208: "Mint", -14931855: "Navy", -2919655: "Amber", -3932263: "Spring Green",
    -7274496: "Maroon", -2254337: "Lavender",
}


def rgb(value):
    value &= 0xFFFFFF
    return (value >> 16) & 255, (value >> 8) & 255, value & 255


def nearest_dye(hex_color, table):
    target = rgb(int(hex_color[1:], 16))
    best = min(table, key=lambda k: sum((a - b) ** 2 for a, b in zip(rgb(k), target)))
    return table[best], "#%02x%02x%02x" % rgb(best)


def main(jar, src, pack, out):
    lang = load(os.path.join(jar, "assets", MOD, "lang", "en_us.json"))
    data_dir = os.path.join(jar, "data", MOD)
    mods_toml = open(os.path.join(jar, "META-INF", "neoforge.mods.toml"), encoding="utf-8").read()
    version = re.search(r'version="([^"]+)"', mods_toml).group(1)

    def name_of(item_id):
        path = item_id.split(":")[-1]
        for key in ("item.%s.%s" % (MOD, path), "block.%s.%s" % (MOD, path)):
            if key in lang:
                return lang[key]
        return path.replace("_", " ").title()

    def tag(*parts):
        path = os.path.join(jar, "data", *parts)
        return load(path)["values"] if os.path.exists(path) else []

    def ids(values):
        return {v if isinstance(v, str) else v["id"] for v in values}

    reg_crops, reg_flowers = parse_registrator(os.path.join(
        src, "src", "main", "java", "cy", "jdkdigital", MOD, "registry", "FarmingRegistrator.java"))

    # villager trades
    trades = {}
    trade_root = os.path.join(data_dir, "villager_trade", "farmer")
    for level in sorted(os.listdir(trade_root)):
        for fname in sorted(os.listdir(os.path.join(trade_root, level))):
            t = load(os.path.join(trade_root, level, fname))
            trades[t["gives"]["id"].split(":")[1]] = {
                "level": int(level.split("_")[1]), "cost": int(t["wants"].get("count", 1)),
                "count": int(t["gives"].get("count", 1)), "uses": int(t["max_uses"]), "xp": int(t["xp"]),
            }

    # mutations
    mutations = []
    for fname in sorted(os.listdir(os.path.join(data_dir, "recipe", "pollination"))):
        r = load(os.path.join(data_dir, "recipe", "pollination", fname))
        mutations.append({
            "target": r["target"].split(":")[1], "pollen": r["pollen"].split(":")[1],
            "pollenVanilla": r["pollen"].startswith("minecraft:"),
            "result": r["mutation"].split(":")[1], "chance": r["chance"],
        })
    mutated = {m["result"] for m in mutations}

    # planter (AgriTech: Evolved) drops
    planter = {}
    pdir = os.path.join(data_dir, "recipe", "agritech_evolved")
    for fname in sorted(os.listdir(pdir)):
        r = load(os.path.join(pdir, fname))
        planter[fname[:-5]] = [
            {"item": d["item"].split(":")[1], "min": d["min"], "max": d["max"], "chance": d["chance"]}
            for d in r["drops"]
        ]

    fencepost = {i.split(":")[1].replace("_seeds", "") for i in ids(tag(MOD, "tags", "item", "fencepost_crops.json"))}
    stat_items = {i.split(":")[1] for i in ids(tag(MOD, "tags", "item", "stat_crops.json")) if ":" in i}
    villages = {}
    for biome in ("plains", "savanna", "snowy", "taiga", "desert"):
        for i in ids(tag(MOD, "tags", "block", biome + "_village_farm_crops.json")):
            if i.startswith(MOD):
                villages.setdefault(i.split(":")[1], []).append(biome)
    kitchen = {}
    for label, fname in (("Berry", "berries.json"), ("Corn", "corn.json"), ("Herb", "herbs.json"),
                         ("Leafy green", "leafy_greens.json"), ("Mushroom", "mushrooms.json"),
                         ("Tomato", "tomatoes.json"), ("Cherry tomato", "cherry_tomatoes.json"),
                         ("Vegetable", "vegetables.json"), ("Tobacco", "tobaccos.json")):
        for i in ids(tag("c", "tags", "item", fname)):
            if i.startswith(MOD):
                kitchen.setdefault(i.split(":")[1], []).append(label)
    crates = {f[:-5] for f in os.listdir(os.path.join(data_dir, "recipe", "crates")) if not f.endswith("_unpack.json")}
    bags = {f[:-5].replace("_seeds", "") for f in os.listdir(os.path.join(data_dir, "recipe", "seed_bags"))
            if not f.endswith("_unpack.json")}
    traits = {k.split(":")[1]: v for k, v in load(os.path.join(data_dir, "data_maps", "item", "crop_traits.json"))["values"].items()}

    crops = []
    for c in reg_crops:
        cid = c["id"]
        vanilla = c["list"] == "VANILLA_CROPS"
        if not vanilla and ("block.%s.%s" % (MOD, cid)) not in lang and ("item.%s.%s" % (MOD, cid)) not in lang:
            continue  # declared in source but not shipped
        plant = cid + "_seeds" if c["seed"] else cid
        entry = {
            "id": cid, "name": name_of(cid) if not vanilla else cid.title(),
            "latin": lang.get("tooltip.%s.%s.latin" % (MOD, cid), "") or None,
            "form": c["form"], "vanilla": vanilla,
            "plant": (name_of(plant) if not vanilla else None), "hasSeed": c["seed"],
            "food": c["food"],
            "trade": trades.get(plant), "mutated": cid in mutated,
            "planter": planter.get(cid), "crate": cid in crates, "bag": cid in bags,
            "fence": cid in fencepost, "stat": plant in stat_items or cid in stat_items,
            "villages": sorted(villages.get(cid, [])), "kitchen": sorted(kitchen.get(cid, [])),
            "startTraits": traits.get(cid),
        }
        crops.append(entry)
    crops.sort(key=lambda e: e["name"])

    bonemeal = {i.split(":")[1] for i in ids(tag(MOD, "tags", "block", "can_spawn_from_bonemeal.json"))}
    all_dyes = dict(VANILLA_DYES)
    all_dyes.update(DYENAMICS_DYES)
    flowers = []
    for f in reg_flowers:
        vanilla_dye, _ = nearest_dye(f["color"], VANILLA_DYES)
        pack_dye, pack_hex = nearest_dye(f["color"], all_dyes)
        flowers.append({
            "id": f["id"], "name": name_of(f["id"]).replace(" Of The ", " of the "), "color": f["color"], "tall": f["tall"], "vine": f["vine"],
            "wild": f["id"] in bonemeal, "dye": pack_dye, "dyeHex": pack_hex, "vanillaDye": vanilla_dye,
            "dyenamics": pack_dye in DYENAMICS_DYES.values(),
        })

    # hand-crafted recipes
    def ing(value):
        if isinstance(value, dict):
            value = value.get("item") or value.get("tag") or value.get("id")
        pretty = {
            "#minecraft:stone_bricks": "Any stone bricks", "#c:rods/wooden": "Stick", "#c:corn": "Any corn",
            "#c:ingots/copper": "Copper ingot", "#c:chests/wooden": "Wooden chest", "#c:ingots/iron": "Iron ingot",
            "#c:buckets/empty": "Bucket", "#minecraft:flowers": "Any flower",
            "productivelib:upgrade_base": "Upgrade Base (Productive Lib)",
        }
        if value in pretty:
            return pretty[value]
        if value.startswith("minecraft:"):
            return value.split(":")[1].replace("_", " ").capitalize()
        return name_of(value)

    crafting = []
    rdir = os.path.join(data_dir, "recipe")
    for fname in sorted(os.listdir(rdir)):
        if not fname.endswith(".json"):
            continue
        r = load(os.path.join(rdir, fname))
        if r["type"] == "minecraft:crafting_shaped":
            grid = [[(ing(r["key"][ch]) if ch != " " else None) for ch in row] for row in r["pattern"]]
            result = r["result"]["id"]
            crafting.append({
                "id": fname[:-5], "kind": "shaped", "grid": grid,
                "result": "Pollen Sieve Upgrade" if result.endswith("upgrade_pollen_sieve") else ing(result),
                "count": r["result"].get("count", 1),
                "needs": "Productive Bees" if "neoforge:conditions" in r else None,
            })
        elif r["type"] == "minecraft:crafting_shapeless":
            names = [ing(i) for i in r["ingredients"]]
            counts = {}
            for n in names:
                counts[n] = counts.get(n, 0) + 1
            crafting.append({
                "id": fname[:-5], "kind": "shapeless", "inputs": [{"name": k, "count": v} for k, v in counts.items()],
                "result": ing(r["result"]["id"]), "count": r["result"].get("count", 1), "needs": None,
            })
    cooking = []
    cdir = os.path.join(rdir, "cooking")
    for fname in sorted(os.listdir(cdir)):
        r = load(os.path.join(cdir, fname))
        cooking.append({
            "input": ing(r["ingredient"]), "result": ing(r["result"]["id"]),
            "station": "Smoker" if r["type"].endswith("smoking") else r["type"].split(":")[1].capitalize(),
            "seconds": r["cookingtime"] / 20, "xp": r["experience"],
        })

    walls_raw = tag(MOD, "tags", "block", "farm_wall_blocks.json")
    walls = [ing(w) if not w.startswith("#c:glass") else "Any glass block" for w in ids(walls_raw)]
    fish = [i.split(":")[1].replace("_", " ").title() for i in ids(tag(MOD, "tags", "entity_type", "fish_farm_entities.json"))]
    stat_chance = load(os.path.join(data_dir, "data_maps", "item", "stat_increase_chance.json"))["values"]
    compost = load(os.path.join(jar, "data", "neoforge", "data_maps", "item", "compostables.json"))["values"]

    manifest = load(os.path.join(pack, "manifest.json"))
    pinned = next((f for f in manifest["files"] if f["projectID"] == 944463), None)
    pack_mods = open(os.path.join(pack, "modlist.html"), encoding="utf-8").read()

    def in_pack(slug):
        return ("/mc-mods/%s\"" % slug) in pack_mods

    payload = {
        "meta": {
            "modVersion": version, "minecraft": manifest["minecraft"]["version"],
            "loader": manifest["minecraft"]["modLoaders"][0]["id"],
            "pack": manifest["name"], "packVersion": manifest["version"],
            "packPinsFile": pinned["fileID"] if pinned else None, "packModCount": len(manifest["files"]),
            "companions": {slug: in_pack(slug) for slug in (
                "productivebees", "productivetrees", "dyenamics", "mystical-agriculture", "agritech-evolved",
                "croptopia", "silent-gear", "jade", "jei")},
        },
        "crops": crops, "flowers": flowers, "mutations": mutations,
        "dyes": [{"name": n, "hex": "#%02x%02x%02x" % rgb(k), "mod": "Dyenamics" if k in DYENAMICS_DYES else "Minecraft"}
                 for k, n in all_dyes.items()],
        "crafting": crafting, "cooking": cooking,
        "farm": {"walls": sorted(walls), "fish": sorted(fish)},
        "statChance": {k.split(":")[1] if ":" in k else k: v for k, v in stat_chance.items()},
        "compost": {k.split(":")[1]: v["chance"] for k, v in compost.items()},
        "counts": {
            "crops": sum(1 for c in crops if not c["vanilla"]), "flowers": len(flowers),
            "mutations": len(mutations), "trades": len(trades), "crates": len(crates), "bags": len(bags),
            "planter": len(planter),
        },
    }
    with open(out, "w", encoding="utf-8") as fh:
        fh.write("// Generated by tools/build_data.py. Do not edit by hand.\n")
        fh.write("window.PF_DATA = ")
        json.dump(payload, fh, ensure_ascii=False, separators=(",", ":"))
        fh.write(";\n")
    print(json.dumps(payload["counts"]), json.dumps(payload["meta"]))


if __name__ == "__main__":
    if len(sys.argv) != 5:
        sys.exit(__doc__)
    main(*sys.argv[1:])
