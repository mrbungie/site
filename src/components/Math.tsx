import React from 'react';

interface Props {
  formula: string;
  block?: boolean;
}

const MathFormula: React.FC<Props> = ({ formula, block = false }) => {
  if (block) {
    return (
      <div className="tex2jax_process my-8 flex justify-center overflow-x-auto py-4">
        {`\\[${formula}\\]`}
      </div>
    );
  }

  return (
    <span className="tex2jax_process font-serif italic text-teal-700">
      {`\\(${formula}\\)`}
    </span>
  );
};

export default MathFormula;
