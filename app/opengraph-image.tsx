import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { business } from "@/data/site";

export const alt = `${business.name}: pressure washing in ${business.primaryArea}, Maryland`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Link preview card for texts and social posts, built at deploy time. */
export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/pelican/logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 56,
          padding: "0 80px",
          background: "#0b1d33",
          color: "white",
        }}
      >
        <img src={logoSrc} width={380} height={380} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 20, width: 620 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05 }}>
            Pressure washing for Southern Maryland.
          </div>
          <div style={{ fontSize: 30, color: "#9fd9e2" }}>
            {`Free quotes · ${business.phone.display}`}
          </div>
        </div>
      </div>
    ),
    size
  );
}
