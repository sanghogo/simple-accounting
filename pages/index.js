import { useState } from "react";

export default function Home() {
  const [date, setDate] = useState("");
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [records, setRecords] = useState([]);

  const handleSave = () => {
    if (!client || !amount) {
      alert("거래처명과 금액은 필수 입력입니다.");
      return;
    }
    const newRecord = { date, client, amount, memo };
    setRecords([newRecord, ...records]);
    setClient("");
    setAmount("");
    setMemo("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>간단 회계 프로그램</h1>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} /><br/><br/>
      <input placeholder="거래처명" value={client} onChange={(e) => setClient(e.target.value)} /><br/><br/>
      <input placeholder="금액" value={amount} onChange={(e) => setAmount(e.target.value)} /><br/><br/>
      <textarea placeholder="메모" value={memo} onChange={(e) => setMemo(e.target.value)} /><br/><br/>
      <button onClick={handleSave}>저장</button>
      <hr/>
      <ul>
        {records.map((r, idx) => (
          <li key={idx}>{r.date} - {r.client} - {r.amount}원 {r.memo && `(${r.memo})`}</li>
        ))}
      </ul>
    </div>
  );
}