export default function ShareCard({
  eyebrow,
  title,
  description,
  image,
  price,
}) {
  const shortDescription =
    description.length > 115
      ? `${description.slice(0, 112).trimEnd()}...`
      : description;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 56,
        gap: 42,
        color: "#2b1b13",
        background: "linear-gradient(135deg, #fff8ed 0%, #f3dfbd 100%)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: 610,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: "#995019",
            fontSize: 19,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            marginTop: 26,
            fontSize: title.length > 32 ? 48 : title.length > 23 ? 56 : 66,
            fontWeight: 700,
            lineHeight: 1.08,
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 22,
            fontSize: 24,
            lineHeight: 1.35,
            color: "#604b3b",
          }}
        >
          {shortDescription}
        </div>
        {price ? (
          <div
            style={{
              marginTop: 24,
              color: "#995019",
              fontSize: 25,
              fontWeight: 700,
            }}
          >
            {price}
          </div>
        ) : (
          <div
            style={{
              marginTop: 28,
              color: "#995019",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            Ethiopian cuisine · Addis Eats
          </div>
        )}
      </div>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders native image tags.
        <img
          src={image}
          alt=""
          style={{
            width: 420,
            height: 420,
            borderRadius: 28,
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          style={{
            width: 420,
            height: 420,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 28,
            backgroundColor: "#6b381c",
            color: "#fff8ed",
            fontSize: 56,
            fontWeight: 700,
          }}
        >
          Addis Eats
        </div>
      )}
    </div>
  );
}
