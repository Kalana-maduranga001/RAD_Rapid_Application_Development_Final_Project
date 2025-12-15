import React from "react";

const About: React.FC = () => {
  return (
    <section style={styles.container}>
      <h2 style={styles.title}>About Our Brand</h2>

      <p style={styles.text}>
        We are a modern clothing brand focused on delivering high-quality,
        stylish, and comfortable apparel for everyday life. Our designs
        combine street culture, simplicity, and global fashion trends.
      </p>

      <p style={styles.text}>
        Every product is carefully crafted using premium fabrics and
        attention to detail. We believe clothing is more than fashion —
        it is a form of self-expression and confidence.
      </p>

      <p style={styles.text}>
        From casual wear to standout pieces, our collections are made for
        individuals who value originality, comfort, and bold style.
      </p>
    </section>
  );
};

const styles = {
  container: {
    padding: "60px 20px",
    maxWidth: "900px",
    margin: "0 auto",
    textAlign: "center" as const,
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "20px",
    fontWeight: "700",
  },
  text: {
    fontSize: "1.1rem",
    lineHeight: "1.8",
    marginBottom: "16px",
    color: "#555",
  },
};

export default About;