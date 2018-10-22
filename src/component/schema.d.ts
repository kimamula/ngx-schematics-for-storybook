import { Schema as OriginalSchema } from '@schematics/angular/component/schema';

export interface Schema extends OriginalSchema {
  noStory?: boolean;
  useTemplate?: boolean;
  tagAsLabel?: boolean;
  replacePath: string; // which should be stringified form of { from: string, to: string }[];
  useComponentDir?: boolean;
}