import { pool } from "./src/config/db.js";
import bcrypt from "bcryptjs";

const baseUrl = 'http://localhost:5000';

async function runTests() {
    console.log('--- Starting Password Recovery (Phone/OTP) Integration Tests ---');

    const testPhone = '1234567890';

    // 1. Ensure test user has the phone number in DB
    try {
        const hashed = await bcrypt.hash('OldPassword123', 10);
        // clear existing test user if any
        try {
            await pool.query('DELETE FROM accounts WHERE phone = $1 OR email = $2', [testPhone, 'test_otp@example.com']);
        } catch (_) { }
        await pool.query(
            'INSERT INTO accounts (name, email, password, phone) VALUES ($1, $2, $3, $4)',
            ['Test OTP User', 'test_otp@example.com', hashed, testPhone]
        );
        console.log('✅ Prepared test user in DB');
    } catch (err) {
        console.error('❌ Failed to prepare test user:', err.message);
        process.exit(1);
    }

    // 2. Request OTP
    try {
        const reqRes = await fetch(`${baseUrl}/api/auth/reset/request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: testPhone })
        });
        const reqData = await reqRes.json();
        console.log('POST /request response:', reqData);
        if (!reqRes.ok) throw new Error(reqData.error);
    } catch (err) {
        console.error('❌ Request OTP failed:', err.message);
        process.exit(1);
    }

    // 3. Query the DB to retrieve the OTP
    let otp = '';
    try {
        const dbRes = await pool.query('SELECT reset_otp FROM accounts WHERE phone = $1', [testPhone]);
        otp = dbRes.rows[0].reset_otp;
        console.log('✅ Retrieved OTP from DB:', otp);
        if (!otp) throw new Error('OTP is empty');
    } catch (err) {
        console.error('❌ Failed to read OTP from DB:', err.message);
        process.exit(1);
    }

    // 4. Verify OTP
    try {
        const verifyRes = await fetch(`${baseUrl}/api/auth/reset/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: testPhone, otp })
        });
        const verifyData = await verifyRes.json();
        console.log('POST /verify response:', verifyData);
        if (!verifyRes.ok || !verifyData.valid) throw new Error('OTP verification rejected');
        console.log('✅ OTP verify successful');
    } catch (err) {
        console.error('❌ Verify OTP failed:', err.message);
        process.exit(1);
    }

    // 5. Reset Password
    try {
        const resetRes = await fetch(`${baseUrl}/api/auth/reset/reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: testPhone, otp, newPassword: 'NewPassword123' })
        });
        const resetData = await resetRes.json();
        console.log('POST /reset response:', resetData);
        if (!resetRes.ok) throw new Error(resetData.error);
        console.log('✅ Password reset successful!');
    } catch (err) {
        console.error('❌ Reset Password failed:', err.message);
        process.exit(1);
    }

    console.log('🎉 All password recovery integration tests passed!');
    pool.end();
}

runTests();
