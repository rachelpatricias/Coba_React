import React, { useEffect, useEffectEvent, useState } from "react";
import { Container, Form, FloatingLabel, Button, Card } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PembayaranPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const bookingId = location.state?.bookingId || null;

    const [booking, setBooking] = useState(null);
    const [service, setService] = useState(null);
    const [form, setForm] = useState({
        paymentMethod: '',
        price: ''
    });

    useEffect(() => {
        if(!bookingId) return;

        const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
        const services = JSON.parse(localStorage.getItem("services")) || [];

        const selectedBooking = bookings.find(b => b.id === bookingId);
        if (!selectedBooking) return;
        const selectedService = services.find(s => s.id === selectedBooking.serviceId);

        setBooking(selectedBooking);
        setService(selectedService);

        setForm(f => ({ ...f, price: selectedService?.price || "" }));
    }, [bookingId]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!paymentMethod || form.price){
            return toast.error("Lengkapi semua field.");
        }

        const payments = JSON.parse(localStorage.getItem("payments") || "[]");

        const newPayment = {
            id: Date.now().toString(),
            bookingId: bookingId,
            serviceId: booking.serviceId,
            paymentDate: new Date().toISOString().split("T")[0],
            paymentMethod: form.paymentMethod,
            price: parseInt(form.price),
            status: "Lunas"
        };

        payments.push(newPayment);
        localStorage.setItem("payments", JSON.stringify(payments));

        const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
        const updated = bookings.map(b => b.id === booking.id ? { ...b, status: "Selesai" } : b);
        localStorage.setItem("bookings", JSON.stringify(updated));

        toast.success("Pembayaran berhasil.");
        navigate("/pesanan");
    };

    if(!booking){
        return(
                <Container className="mt-3">
                    <h3>Pesanan tidak ditemukan.</h3>
                </Container>
        );
    }

    return(
        <Container className="mt-3">
            <h2>Pembayaran</h2>

            <Card className="p-3 mb-3">
                <h5>Detail Pesanan</h5>
                <div>Layanan: <strong>{service?.name}</strong></div>
                <div>Tanggal: {booking.date}</div>
                <div>Status Pesanan: {booking.status}</div>
            </Card>

            <Form onSubmit={handleSubmit}>
                <FloatingLabel label="Metode Pembayaran" className="mb-3">
                    <Form.Select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
                        <option value="">--Pilih Metode--</option>
                        <option value="Cash">Cash</option>
                        <option value="Transfer">Transfer</option>
                        <option value="E-Wallet">E-Wallet</option>
                    </Form.Select>
                </FloatingLabel>

                <FloatingLabel label="Jumlah Pembayaran (Rp)" className="mb-3">
                    <Form.Control type="number" name="price" value={form.price} onChange={handleChange}/>
                </FloatingLabel>
                
                <Button type="submit" className="mt-2">
                    Bayar Sekarang
                </Button>
            </Form>
        </Container>
    );
};


export default PembayaranPage;