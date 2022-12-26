import MidAutumn from "./mid-autumn";
import { config as MidConfig } from "./mid-autumn/config";
import { config as turntableConfig } from "./turntable/config";
import Turntable from "./turntable";
export const mode = {
  m1: {
    commont: MidAutumn,
    config: MidConfig,
  },
  m2: {
    commont: Turntable,
    config: turntableConfig,
  },
};
