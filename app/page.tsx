"use client"

import React, {useEffect, useState} from "react";
// @ts-ignore
import BitcoinAddress from "./components/BitcoinAddress";
import axios from "axios";



export default function Home() {
    const [addresses, setAddresses] = useState<string[]>([]);
    const API_URL = "http://localhost:4000";
    const WALLET_ID = '67bdae91452b911e4706bc92';


    // Fetch addresses from the backend
    const getAddresses = async () => {
        try {
            const response = await axios.get(`${API_URL}/wallet/${WALLET_ID}`);
            const addressList = response.data.bitcoin_addresses.map((addrObj: { address: string }) => addrObj.address);
            setAddresses(addressList);
        } catch (error: any) {
            console.error("Error fetching addresses:", error.response?.data || error.message);
        }
    };

    // Fetch addresses when component mounts
    useEffect(() => {
        getAddresses();
    }, []);



    const addAddress = async (address: string) => {
        try {
            if (addresses.includes(address)) {
                alert("This Bitcoin address is already in the list.");
                return;
            }

            const response = await axios.patch(`${API_URL}/wallet/${WALLET_ID}`, {
                address,
            });

            console.log("Response Data:", response.data);
            setAddresses((prevAddresses) => [...prevAddresses, address]);

        } catch (error: any) {
            console.error("Error adding address:", error.response?.data || error.message);
        }
    };


    const deleteAddress = async (addressToRemove: string) => {
        try {
            console.log(`Attempting to delete address: ${addressToRemove}`);

            await axios.delete(`${API_URL}/wallet/${WALLET_ID}/address/${addressToRemove}`);

            setAddresses((prevAddresses) =>
                prevAddresses.filter((addr) => addr !== addressToRemove)
            );

            alert("Bitcoin address removed successfully!");
        } catch (error: any) {
            console.error("❌ Error deleting address:", error.response?.data || error.message);
        }
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">

                <BitcoinAddress
                    addAddress={addAddress}
                    deleteAddress={deleteAddress}
                    addresses={addresses}
                />
            </main>

        </div>
    );
}

