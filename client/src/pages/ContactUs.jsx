import React from 'react';

function ContactUs() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">ติดต่อเรา</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold">ข้อมูลบริษัท</h3>
        <p className="mt-2">ชื่อบริษัท: Oat-Ecom</p>
        <p>เบอร์โทร: 012-345-6789</p>
        <p>อีเมล: info@oatecom.com</p>
      </div>

      <div className="mb-6">
<h3 className="text-xl font-semibold">ที่อยู่</h3>
<p className="mt-2">123 ถนนหลัก, เขตบางเขน, กรุงเทพมหานคร, ประเทศไทย</p>
<div className="mt-4">

</div>
</div>

        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold">🗺️ แผนที่จาก Google Maps</h3>
          <img
            src="/images/messageImage_1740929134077.jpg" // เปลี่ยนเป็นรูปที่คุณแคปมา
            alt="แผนที่จาก Google Maps"
            className="w-full h-48 object-cover rounded-lg shadow-md mt-2"
          />
        </div>


      <div className="text-center">
        <p>หากท่านมีคำถามหรือต้องการข้อมูลเพิ่มเติม เช่นลืมรหัสผ่าน อยากให้ปรับปรุงส่วนไหน กรุณาติดต่อเราตามข้อมูลข้างต้น</p>
      </div>
    </div>
  );
}

export default ContactUs;

/* แผนที่จริง
<div className="mb-6">
<h3 className="text-xl font-semibold">ที่อยู่</h3>
<p className="mt-2">123 ถนนหลัก, เขตบางเขน, กรุงเทพมหานคร, ประเทศไทย</p>
<div className="mt-4">
  <iframe
    title="Google Maps"
    className="w-full h-64"
    src="https://www.google.com/maps/embed/v1/place?q=123+%E0%B8%96%E0%B8%99%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81,+%E0%B9%80%E0%B8%82%E0%B8%95%E0%B8%9A%E0%B8%B2%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%99,+%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%A1%E0%B8%8D,+%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%97%E0%B8%A8%E0%B9%84%E0%B8%97%E0%B8%A2&key=YOUR_GOOGLE_MAPS_API_KEY"
    allowFullScreen
  />
</div>
</div>
*/