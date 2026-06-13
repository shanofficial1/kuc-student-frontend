import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const isObject = (value) => value && typeof value === 'object' && !Array.isArray(value);
const isFile = (value) => typeof File !== 'undefined' && value instanceof File;

const deepEqual = (a, b) => {
  if (a === b) return true;
  if (isFile(a) || isFile(b)) return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }
  if (isObject(a) && isObject(b)) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((key) => deepEqual(a[key], b[key]));
  }
  return a === b;
};

const isEmptyValue = (value) =>
  value === undefined ||
  value === null ||
  value === "" ||
  (Array.isArray(value) && value.length === 0) ||
  (isObject(value) && Object.keys(value).length === 0);

export function getChangedFields(original = {}, current = {}) {
  if (deepEqual(original, current)) {
    return {};
  }

if (Array.isArray(current)) {
  if (!Array.isArray(original)) {
    return current;
  }

  // Keep payload simple for review, but also preserve existing behavior:
  // - if arrays are deep-equal -> no changes
  // - otherwise, return the *added items* for arrays of primitives/empty objects
  //   OR return current for arrays of objects to detect edits inside items.
  if (deepEqual(original, current)) {
    return {};
  }

  const addedItems = current.filter(
    (item) => !original.some((old) => deepEqual(old, item))
  );

  // If the array contains objects, return the whole current array so edited
  // fields inside existing items (e.g., siblings / academic records) show in review.
  const hasObjects = current.some((it) => it && typeof it === 'object' && !Array.isArray(it));
  return hasObjects ? current : addedItems;
}





  if (isFile(current)) {
    return !deepEqual(original, current) ? current : {};
  }

  if (!isObject(current)) {
    return !deepEqual(original, current) ? current : {};
  }

  const changed = {};

  for (const key of Object.keys(current)) {
    if (key.endsWith("Error")) continue;

    const oldValue = original?.[key];
    const newValue = current[key];

    if (isFile(newValue)) {
      if (!deepEqual(oldValue, newValue)) {
        changed[key] = newValue;
      }
      continue;
    }

    if (Array.isArray(newValue) || isObject(newValue)) {
      const nested = getChangedFields(oldValue, newValue);
      if (Array.isArray(newValue)) {
        if (nested.length > 0) {
          changed[key] = nested;
        }
      } else if (Object.keys(nested).length > 0) {
        changed[key] = nested;
      }
      continue;
    }

    if (!deepEqual(oldValue, newValue)) {
      if (isEmptyValue(newValue) && isEmptyValue(oldValue)) {
        continue;
      }
      changed[key] = newValue;
    }
  }

  return changed;
}

export const SECTION_API_KEYS = {
  academic: "academic_details",
  personal: "personal_details",
  contact: "contact_details",
  health: "health_details",
  family: "family_details",
  education: "education_details",
  financial: "financial_details",
  professional: "professional_details",
  residential: "residential_details",
  documents: "documents",
};
