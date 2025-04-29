import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { format } from "date-fns";
import { motion } from "framer-motion";

import { db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";

export default function SimpleAccountingApp() {
  const [date, setDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [records, setRecords] = useState([]);
  const [filterMonth, setFilterMonth] = useState("");
  const [clientsList, setClientsList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "records"));
        const fetchedData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecords(fetchedData.reverse());

        const clientsSnapshot = await getDocs(collection(db, "clients"));
        const fetchedClients = clientsSnapshot.docs.map(doc => doc.id);
        setClientsList(fetchedClients);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    if (!client || !amount) {
      alert("거래처명과 금액은 필수 입력입니다.");
      return;
    }
    const newRecord = { date, client, amount, memo };
    try {
      await addDoc(collection(db, "records"), newRecord);
      alert("저장 완료!");
      setClient("");
      setAmount("");
      setMemo("");
      const querySnapshot = await getDocs(collection(db, "records"));
      const fetchedData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecords(fetchedData.reverse());

      if (!clientsList.includes(client)) {
        await setDoc(doc(db, "clients", client), {});
        setClientsList((prev) => [...prev, client]);
      }
    } catch (error) {
      console.error("저장 실패:", error);
    }
  };

  const handleExport = () => {
    const header = "날짜,거래처명,금액,메모\n";
    const csvContent =
      header +
      records
        .map((r) => `${r.date},${r.client},${r.amount},${r.memo}`)
        .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `simple_accounting_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (index) => {
    const recordToDelete = filteredRecords[index];
    if (!recordToDelete?.id) return;

    try {
      await deleteDoc(doc(db, "records", recordToDelete.id));
      const updated = [...records].filter((r) => r.id !== recordToDelete.id);
      setRecords(updated);
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  const getMonthlyTotal = () => {
    const month = date.slice(0, 7);
    return records
      .filter((r) => r.date.startsWith(month))
      .reduce((sum, r) => sum + Number(r.amount), 0);
  };

  const filteredRecords = filterMonth
    ? records.filter((r) => r.date.startsWith(filterMonth))
    : records;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold text-center mb-6">간단 회계 프로그램</h1>
        <Card className="max-w-md mx-auto p-6 shadow-lg rounded-2xl">
          <CardContent className="grid gap-4">
            <Input type="date" className="h-12 rounded-xl" value={date} onChange={(e) => setDate(e.target.value)} />

            <Select onValueChange={setClient} value={client}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="거래처 선택 또는 추가" />
              </SelectTrigger>
              <SelectContent>
                {clientsList.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input placeholder="금액" className="h-12 rounded-xl" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <Textarea placeholder="메모 (선택사항)" className="rounded-xl" value={memo} onChange={(e) => setMemo(e.target.value)} />
            <Button className="h-12 text-lg rounded-xl" onClick={handleSave}>저장하기</Button>
            <Button className="h-12 text-lg rounded-xl" onClick={handleExport} variant="outline">엑셀(CSV)로 내보내기</Button>
            <div className="text-right font-semibold text-blue-600 mt-2">
              📊 이번 달 총합: {getMonthlyTotal().toLocaleString()} 원
            </div>
            <div className="mt-4">
              <Input
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="mt-8 grid gap-2 max-w-md mx-auto">
        {filteredRecords.map((r, idx) => (
          <Card key={r.id || idx} className="p-4 shadow-sm rounded-2xl">
            <CardContent>
              <div className="font-semibold">📅 {r.date}</div>
              <div>🏢 {r.client}</div>
              <div>💰 {Number(r.amount).toLocaleString()} 원</div>
              {r.memo && <div>📝 {r.memo}</div>}
              <div className="text-right mt-2">
                <Button variant="destructive" size="sm" onClick={() => handleDelete(idx)}>삭제</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
