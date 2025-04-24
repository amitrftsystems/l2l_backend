-- AlterTable
CREATE SEQUENCE property_property_id_seq;
ALTER TABLE "Property" ALTER COLUMN "property_id" SET DEFAULT nextval('property_property_id_seq');
ALTER SEQUENCE property_property_id_seq OWNED BY "Property"."property_id";
