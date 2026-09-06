# Checks used by `structured-data`

19 checks. Generated from the Wrendex check catalog
(`GET https://app.wrendex.com/api/catalog`) - do not edit by hand.

Filter a crawl to one of these with
`GET /api/crawls/{crawlId}/issue-summary?type=<TYPE>`, or to a whole category
with `?category=<Category>`.

## Structured Data

### `JSON_LD_PARSE_ERROR`

**JSON-LD parse error** (ERROR)

A JSON-LD script block could not be parsed as valid JSON.

**Fix:** Fix the JSON syntax. Validate with a linter before shipping.

### `JSON_LD_INVALID_TYPE`

**JSON-LD invalid @type** (WARNING)

The @type does not exist on schema.org or is misspelled.

**Fix:** Replace with a valid schema.org type that fits the content.

### `JSON_LD_MISSING_TYPE`

**JSON-LD missing @type** (WARNING)

A JSON-LD object has no @type. Search engines cannot interpret it.

**Fix:** Add an @type that names the schema (for example, Article, Product).

### `JSON_LD_DEPRECATED_PROPERTY`

**JSON-LD deprecated property** (NOTICE)

The JSON-LD object uses a property that has been deprecated.

**Fix:** Migrate to the recommended replacement property.

### `JSON_LD_DEPRECATED_TYPE`

**JSON-LD deprecated type** (NOTICE)

The JSON-LD object uses a schema.org type that has been deprecated.

**Fix:** Migrate to the recommended replacement type listed in the schema.org docs.

### `JSON_LD_DUPLICATE_PROPERTY`

**JSON-LD duplicate property** (NOTICE)

The same property is declared more than once on a JSON-LD object.

**Fix:** Remove the duplicate or merge into an array if multiple values are intended.

### `JSON_LD_INVALID_PROPERTY`

**JSON-LD invalid property** (NOTICE)

A property on the JSON-LD object is not defined for the declared @type.

**Fix:** Remove the property or move it to a parent / nested object that allows it.

### `JSON_LD_INVALID_VALUE`

**JSON-LD invalid value** (NOTICE)

A property's value is not in the expected format (for example, malformed URL).

**Fix:** Fix the value to match the expected format.

### `JSON_LD_UNEXPECTED_PROPERTY`

**JSON-LD unexpected property** (NOTICE)

An unrecognised property appeared on a JSON-LD object.

**Fix:** Remove the property or replace with a recognised schema.org one.

### `JSON_LD_UNEXPECTED_PROPERTY_TYPE`

**JSON-LD wrong property type** (NOTICE)

A property's value type does not match the schema.org expected type (for example, string instead of Date).

**Fix:** Coerce the value to the expected type.

## Structured Data (Google)

### `JSON_LD_GOOGLE_MISSING_IMAGE`

**Google rich result missing image** (WARNING)

Google's rich result for this type requires an image and none was provided.

**Fix:** Add an image property pointing at a high-quality, public image.

### `JSON_LD_GOOGLE_MISSING_ONE_OF_REQUIRED`

**Google rich result missing one-of required** (WARNING)

Google requires at least one of a set of fields and none are present.

**Fix:** Add at least one of the required fields documented for the rich-result type.

### `JSON_LD_GOOGLE_MISSING_REQUIRED`

**Google rich result missing required field** (WARNING)

A field Google requires for the rich result is missing. The page is ineligible until it is added.

**Fix:** Add the required field as listed in Google's rich-result documentation.

### `JSON_LD_GOOGLE_EMPTY_FIELD`

**Google rich result empty field** (NOTICE)

A field that should hold a value is empty.

**Fix:** Populate the field with a meaningful value or remove it if optional.

### `JSON_LD_GOOGLE_INVALID_DATE`

**Google rich result invalid date** (NOTICE)

A date field is not in ISO 8601 format.

**Fix:** Use ISO 8601 (for example, 2026-04-30T12:00:00Z).

### `JSON_LD_GOOGLE_INVALID_VALUE`

**Google rich result invalid value** (NOTICE)

A field's value is outside the format Google expects.

**Fix:** Update the value to match Google's documented format.

### `JSON_LD_GOOGLE_PROPERTY_MISSING_TYPE`

**Google rich result property missing type** (NOTICE)

A nested object that Google expects to be typed has no @type.

**Fix:** Add the expected @type on the nested object.

### `JSON_LD_GOOGLE_UNRECOGNIZED_PROPERTY`

**Google rich result unrecognised property** (NOTICE)

A property is not recognised by Google for this rich-result type.

**Fix:** Remove the property or replace with a documented one.

### `JSON_LD_GOOGLE_UNRESOLVED_ID`

**Google rich result unresolved @id** (NOTICE)

An @id reference does not match any object on the page.

**Fix:** Add the referenced object or fix the @id to point at an existing one.
