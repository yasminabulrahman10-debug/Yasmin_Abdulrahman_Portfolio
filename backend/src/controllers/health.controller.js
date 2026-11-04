exports.getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Yasmin Portfolio API is running",
    data: {
      service: "yasmin-portfolio-api",
      environment: process.env.NODE_ENV || "development"
    }
  });
};
