import { Schema as OriginalSchema } from '@schematics/angular/component/schema';

export interface Schema extends OriginalSchema {
  noStory?: boolean;
  useTemplate?: boolean;
}