#!/usr/bin/env python3
"""Build an explicit allowlisted source plugin ZIP; no credentials or dev files."""
import hashlib
import json
from pathlib import Path
import zipfile
ROOT = Path(__file__).resolve().parents[1]
FILES = ['manifest.json', 'index.js', 'provider-support.json', 'LICENSE', 'README.md', 'docs/RESEARCH-20261022.md']

def main():
    manifest = json.loads((ROOT / 'manifest.json').read_bytes())
    out = ROOT / 'dist' / f"aide-pkg-ali-bailian-supporter-v{manifest['version']}.zip"
    out.parent.mkdir(exist_ok=True)
    with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
        for name in FILES:
            p = ROOT / name
            if p.is_symlink() or not p.is_file():
                raise SystemExit(f'Invalid package input: {name}')
            info = zipfile.ZipInfo(name, date_time=(2026, 10, 22, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            z.writestr(info, p.read_bytes())
    with zipfile.ZipFile(out) as z:
        assert sorted(z.namelist()) == sorted(FILES)
        assert all(z.read(name) == (ROOT/name).read_bytes() for name in FILES)
    print(json.dumps({'path':str(out),'bytes':out.stat().st_size,'sha256':hashlib.sha256(out.read_bytes()).hexdigest()}, ensure_ascii=False))
if __name__ == '__main__':
    main()
