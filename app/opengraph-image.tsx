import { ImageResponse } from "next/og";

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
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(60% 60% at 50% 30%, #2a2213 0%, #0b0a08 70%)",
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 72,
            borderRadius: "999px",
            border: "2px solid #e3b25c",
            marginBottom: 32,
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2 L12 8"
              stroke="#e3b25c"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M8 8 H16 L19.5 19 A2 2 0 0 1 17.6 22 H6.4 A2 2 0 0 1 4.5 19 Z"
              stroke="#e3b25c"
              strokeWidth="1.6"
            />
            <path
              d="M6.2 15 H17.8"
              stroke="#e3b25c"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div
          style={{
            fontSize: 72,
            color: "#f4efe4",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            textAlign: "center",
            display: "flex",
          }}
        >
          Transformez votre marketing
        </div>
        <div
          style={{
            fontSize: 72,
            color: "#e3b25c",
            fontWeight: 500,
            fontStyle: "italic",
            marginTop: 4,
            display: "flex",
          }}
        >
          en clarté.
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#a89c86",
            marginTop: 36,
            display: "flex",
          }}
        >
          Audit marketing & SEO gratuit — résultat en 5 minutes
        </div>
      </div>
    ),
    { ...size }
  );
}
