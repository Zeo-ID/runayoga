"use client";

import type { Data } from "@puckeditor/core";
import { Render } from "@puckeditor/core";
import config from "../../lib/puck.config";

export function PageClient({ data }: { data: Data }) {
  return <Render config={config} data={data} />;
}
