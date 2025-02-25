import React, { useState } from 'react'
import '../styles/BitcoinAddress.css';

type Props = {
    addAddress :(address: string) => void;
    deleteAddress :(address: string) => void;
    addresses: string[];
}

function BitcoinAddress({addAddress, deleteAddress, addresses}: Props) {
    const [address, setAddress] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (address) {
            addAddress(address);
            setAddress('');
        }
    };


    // @ts-ignore
    return (
        <div className="container">
            <h2 className="title">CoinTracker Prototype</h2>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="form">
                <input
                    type="text"
                    value={address}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
                    placeholder="Enter Bitcoin address"
                    className="input"
                />
                <button type="submit" className="button">➕ Add Address</button>
            </form>

            {/* Display Bitcoin Addresses */}
            {addresses && addresses.length > 0 ? (
                <ul className="address-list">
                    {addresses.map((addr) => (
                        <li key={addr} className="address-item">
                            <span>{addr}</span>
                            <button
                                onClick={() => deleteAddress(addr)}
                                className="delete-button"
                            >
                                ❌ Delete
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-address">No addresses found</p>
            )}
        </div>
    );
}

export default BitcoinAddress