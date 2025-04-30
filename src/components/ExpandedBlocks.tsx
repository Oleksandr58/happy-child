import { Button } from "@mui/material";
import { ReactElement, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface Args {
  blocks?: ReactElement[];
}

export default function ExpandedBlocks({ blocks }: Args) {
  const [isExpanded, setIsExpanded] = useState(false);
  const blockMapped = blocks
    ? isExpanded
      ? blocks.map((block) => block)
      : blocks[0]
    : null;
  const showExpandedButton = Boolean(blocks && blocks?.length > 1);

  return (
    <>
      {blockMapped}

      {showExpandedButton && (
        <Button
          size="small"
          endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Згорнути" : "Показати всі"}
        </Button>
      )}
    </>
  );
}
