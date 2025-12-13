import { NullishPropertiesOf } from "sequelize/types/utils";
import { BadRequestError } from "../../middleware/Error";
import { File } from "../../models/System";

export const checkDuplicateUploads = (
  payload: Omit<File, NullishPropertiesOf<File>>[]
) => {
  const seen = new Set<string>();
  const duplicates: string[] = [];

  for (const file of payload) {
    const key = `${file.name}-${file.size}`;
    if (seen.has(key)) {
      duplicates.push(file.name);
    } else {
      seen.add(key);
    }
  }

  if (duplicates.length > 0) {
    throw new BadRequestError([
      `Duplicate files detected: ${[...new Set(duplicates)].join(", ")}`,
    ]);
  }
};
