import { useState } from 'react';

export default function HelloReact() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <strong>React</strong>: {count}
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
