import { Chip } from "@material-ui/core";

export const getScoreChip = (score) => {
  if (score === undefined || score === null) return null;

  const percentage = Math.round(score * 100);
  let matchType = "";
  let chipColor = "#9e9e9e"; // default gray

  if (score >= 0.8) {
    matchType = "Excellent Match";
    chipColor = "#4caf50"; // green
  } else if (score >= 0.6) {
    matchType = "Strong Match";
    chipColor = "#8bc34a"; // light green
  } else if (score >= 0.3) {
    matchType = "Good Match";
    chipColor = "#ff9800"; // orange
  } else {
    matchType = "Weak Match";
    chipColor = "#f44336"; // red
  }

  return (
    <Chip
      size="small"
      label={`${percentage}% Match (${matchType})`}
      style={{
        backgroundColor: chipColor,
        color: "#ffffff",
        fontWeight: 600,
        fontSize: '0.75rem'
      }}
    />
  );
};

