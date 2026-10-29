import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { business } from "@/data/site";
import { storyImage } from "@/lib/story";

export const alt = `${business.name}: pressure washing in ${business.primaryArea}, Maryland`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const headline = "Pressure washing for Southern Maryland.";

/**
 * Link preview card for texts and social posts, built at deploy time. Uses
 * the e1-og-bg render (house on the right third) with the headline drawn as
 * text; until that render exists it falls back to the logo card.
 */
export default async function OpengraphImage() {
  const bg = storyImage("e1-og-bg");
  if (bg && !bg.placeholder && bg.jpeg) {
    const photo = await readFile(join(process.cwd(), "public", bg.jpeg));
    const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#0b1d33" }}>
          <img src={photoSrc} width={1200} height={630} alt="" style={{ position: "absolute", inset: 0, objectFit: "cover" }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, rgba(6,16,29,0.88) 0%, rgba(6,16,29,0.6) 45%, rgba(6,16,29,0) 70%)",
            }}
          />
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 22,
              padding: "0 72px",
              width: 700,
              color: "white",
            }}
          >
            <div style={{ fontSize: 24, letterSpacing: 4, textTransform: "uppercase", color: "#9fd9e2", fontWeight: 700 }}>
              {business.name}
            </div>
            <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.04 }}>{headline}</div>
            <div style={{ fontSize: 30, color: "#d6eef2" }}>{`Free written quotes · ${business.phone.display}`}</div>
          </div>
        </div>
      ),
      size
    );
  }

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
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05 }}>{headline}</div>
          <div style={{ fontSize: 30, color: "#9fd9e2" }}>
            {`Free quotes · ${business.phone.display}`}
          </div>
        </div>
      </div>
    ),
    size
  );
}
