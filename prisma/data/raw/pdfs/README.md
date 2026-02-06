# PDF Source Files

Place Nigerian law PDF files here for extraction.

**Note:** PDF files are gitignored to avoid repository bloat.

## Recommended Sources

- [OpenLaws Nigeria](https://openlawsnig.org.ng) - Primary source
- [PLAC](https://placng.org) - Policy and Legal Advocacy Centre
- [Lagos MOJ](http://lagosministryofjustice.org) - Lagos-specific laws

## File Naming Convention

Use kebab-case matching the expected law slug:

```
constitution-1999.pdf
criminal-code.pdf
cama-2020.pdf
labour-act.pdf
lagos-tenancy-law-2011.pdf
copyright-act-2022.pdf
```

## Extraction Commands

```bash
# Extract a single PDF
npm run pdf:extract -- constitution-1999.pdf

# Extract all PDFs in this directory
npm run pdf:extract -- --all

# Check extraction status
npm run pdf:status
```

## After Extraction

1. Review extracted JSON in `../extracted/`
2. Generate TypeScript: `npm run pdf:generate -- <file.json>`
3. Update `prisma/data/laws/index.ts` with new import
4. Seed database: `npm run db:seed`
5. Generate embeddings: `npm run backfill-embeddings`
