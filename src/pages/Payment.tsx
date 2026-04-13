import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

type Transaction = {
    amount: number;
    sender: string;
    receiver: string;
    status: string;
};

export default function Payment() {
    const { user } = useAuth();

    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [amount, setAmount] = useState("");

    // Load data
    useEffect(() => {
        const storedBalance = localStorage.getItem("balance");
        const storedTransactions = localStorage.getItem("transactions");

        if (storedBalance) setBalance(JSON.parse(storedBalance));
        if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
    }, []);

    // Save data
    const updateStorage = (newBalance: number, newTransactions: Transaction[]) => {
        setBalance(newBalance);
        setTransactions(newTransactions);
        localStorage.setItem("balance", JSON.stringify(newBalance));
        localStorage.setItem("transactions", JSON.stringify(newTransactions));
    };

    // Deposit
    const deposit = () => {
        const value = Number(amount);
        if (!value) return;

        const newBalance = balance + value;
        const newTransactions = [
            ...transactions,
            { amount: value, sender: user.name, receiver: user.name, status: "Deposited" },
        ];

        updateStorage(newBalance, newTransactions);
        setAmount("");
    };

    // Withdraw
    const withdraw = () => {
        const value = Number(amount);
        if (!value || value > balance) return;

        const newBalance = balance - value;
        const newTransactions = [
            ...transactions,
            { amount: value, sender: user.name, receiver: user.name, status: "Withdrawn" },
        ];

        updateStorage(newBalance, newTransactions);
        setAmount("");
    };

    // Transfer (Investor → Entrepreneur)
    const transfer = () => {
        const value = Number(amount);
        if (!value || value > balance) return;

        const newBalance = balance - value;
        const newTransactions = [
            ...transactions,
            { amount: value, sender: user.name, receiver: "Entrepreneur", status: "Transferred" },
        ];

        updateStorage(newBalance, newTransactions);
        setAmount("");
    };

    if (!user) return null;

    return (
        <div className="p-6 space-y-6">

            <h2 className="text-2xl font-bold">💳 Payment Wallet</h2>

            {/* Wallet */}
            <div className="bg-gray-100 p-6 rounded-xl shadow">
                <p className="text-gray-600">Current Balance</p>
                <h3 className="text-3xl font-bold text-green-600">
                    ${balance}
                </h3>
            </div>

            {/* Actions (Investor Only) */}
            {user.role === "investor" && (
                <div className="space-y-3">

                    <input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="border p-2 rounded w-full"
                    />

                    <div className="flex gap-3 flex-wrap">
                        <button
                            onClick={deposit}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Deposit
                        </button>

                        <button
                            onClick={withdraw}
                            className="px-4 py-2 bg-gray-600 text-white rounded"
                        >
                            Withdraw
                        </button>

                        <button
                            onClick={transfer}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Fund Startup
                        </button>
                    </div>
                </div>
            )}

            {/* Entrepreneur message */}
            {user.role === "entrepreneur" && (
                <p className="text-gray-600">
                    You can view received funds and transaction history.
                </p>
            )}

            {/* Transactions */}
            <div>
                <h3 className="text-xl font-semibold mb-2">Transaction History</h3>

                {transactions.length === 0 ? (
                    <p className="text-gray-500">No transactions yet</p>
                ) : (
                    <table className="w-full border">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-2">Amount</th>
                                <th className="p-2">Sender</th>
                                <th className="p-2">Receiver</th>
                                <th className="p-2">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {transactions.map((t, index) => (
                                <tr key={index} className="text-center border-t">
                                    <td className="p-2">${t.amount}</td>
                                    <td className="p-2">{t.sender}</td>
                                    <td className="p-2">{t.receiver}</td>
                                    <td className="p-2">{t.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

        </div>
    );
}