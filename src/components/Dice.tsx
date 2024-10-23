

interface DiceProps {
  value: number;
  selected: boolean;
  onSelect: () => void;
}

const Dice: React.FC<DiceProps> = ({ value, selected, onSelect }) => {
  return (
    <div
      className={`dice ${selected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      {value}
    </div>
  );
};

export default Dice;
