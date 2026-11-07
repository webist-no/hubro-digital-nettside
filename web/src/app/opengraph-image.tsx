import { ImageResponse } from "next/og";

// Standard delingsbilde (LinkedIn, Facebook, meldinger) for sider uten eget bilde.
export const alt = "Hubro Digital: digitalt markedsføringsbyrå i Drammen og Oslo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#071119",
          color: "#ffffff",
          padding: 80,
        }}
      >
        <div style={{ fontSize: 40, letterSpacing: -1, color: "#cae780" }}>Hubro Digital</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 92, lineHeight: 1.02, letterSpacing: -3 }}>
          <span>Markedsføring</span>
          <span style={{ color: "#cae780" }}>du forstår.</span>
        </div>
        <div style={{ fontSize: 30, color: "#cbccc7" }}>Digitalt markedsføringsbyrå i Drammen og Oslo</div>
      </div>
    ),
    size,
  );
}
