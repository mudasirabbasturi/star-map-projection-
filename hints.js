<Input
  value={content.message}
  onChange={(e) => onChangeContent({ message: e.target.value })}
  onMouseDown={(e) => e.stopPropagation()}
  onClick={(e) => e.stopPropagation()}
  size="small"
/>;
