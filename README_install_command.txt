https://nodejs.org/en/download/package-manager/current
https://www.postman.com/downloads/
https://dev.mysql.com/downloads/workbench/
https://code.visualstudio.com/download


-----------Server---------------
npm init -y
npm install express morgan cors nodemon bcryptjs jsonwebtoken

npm install prisma
npx prisma init
npm install @prisma/client

// Doc ใช้ในการสร้างและอัพเดตฐานข้อมูล
npx prisma migrate dev --name ecom

//
อัพเดต Prisma schema
npx prisma migrate dev


------------Client--------------
npm create vite@latest
or
npm create vite@latest .
- client
- javascript

>cd client
>npm install
>npm run dev


npm i react-router-dom
npm i axios
npm i zustand axios

npm i react-image-file-resizer
npm i react-toastify
npm i react-icons
npm i lucide-react
npm i lodash
npm i rc-slider
npm i numeral
npm install moment
--------------------------



บัตรเครดิตที่ใช้บ่อย:

4242 4242 4242 4242: บัตรเครดิตที่ใช้สำหรับการทดสอบทั่วไป
4000 0025 0000 3155: บัตรเครดิตที่ใช้ทดสอบกรณี "Card declined"
4000 0000 0000 9995: บัตรเครดิตที่ใช้ทดสอบกรณี "Card declined with an insufficient funds error"
บัตรเครดิตที่ใช้ทดสอบสำหรับการชำระเงินในสถานการณ์ต่าง ๆ:

5555 5555 5555 4444: ใช้ทดสอบการชำระเงินที่สำเร็จ
3782 8224 6310 005: บัตรเครดิต American Express สำหรับการทดสอบ
6011 1111 1111 1117: บัตรเครดิต Discover สำหรับการทดสอบ
บัตรที่ใช้สำหรับการชำระเงินในรูปแบบต่าง ๆ:

4000 0000 0000 0069: ใช้ทดสอบกรณี "Card expired"
4000 0000 0000 9999: ใช้ทดสอบกรณี "Incorrect CVC"
4000 0000 0000 0002: ใช้ทดสอบกรณี "Processing error"