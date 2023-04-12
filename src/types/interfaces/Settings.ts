import { Instance } from "./Instance";

export interface Settings {
  instances: Instance[];
  currentInstance: Instance | null;
  defaultInstance: Instance | null;
}
