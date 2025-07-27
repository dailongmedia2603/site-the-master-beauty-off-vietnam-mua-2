import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="container mx-auto max-w-md p-0">
        <header className="text-center my-8 px-4">
          <h1 className="text-4xl font-bold text-gray-800">Tên Website Của Bạn</h1>
          <p className="text-gray-500 mt-2">Một mô tả ngắn gọn về trang web</p>
        </header>

        <main className="space-y-8">
          <div>
            <img src="/placeholder.svg" alt="Placeholder Image 1" className="w-full h-auto" />
            <p className="text-center text-gray-600 mt-4 px-4">Đây là nơi bạn có thể đặt chú thích cho hình ảnh đầu tiên.</p>
          </div>

          <div>
            <img src="/placeholder.svg" alt="Placeholder Image 2" className="w-full h-auto" />
            <p className="text-center text-gray-600 mt-4 px-4">Và đây là chú thích cho hình ảnh thứ hai.</p>
          </div>

          <div>
            <img src="/placeholder.svg" alt="Placeholder Image 3" className="w-full h-auto" />
            <p className="text-center text-gray-600 mt-4 px-4">Bạn có thể thêm bao nhiêu hình ảnh tùy thích.</p>
          </div>
        </main>

        <footer className="text-center my-8 px-4">
          <p className="text-gray-500">Thông tin liên hệ hoặc lời kết.</p>
          <MadeWithDyad />
        </footer>
      </div>
    </div>
  );
};

export default Index;