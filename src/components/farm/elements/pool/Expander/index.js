import React from "react";
import { ChevronDown, ChevronUp } from "react-feather";

export const Expander = ({ isExpanded }) =>
  isExpanded ? <ChevronUp /> : <ChevronDown />;
