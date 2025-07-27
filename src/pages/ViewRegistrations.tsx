import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

// Định nghĩa kiểu dữ liệu cho một liên hệ
type Contact = {
  id: number;
  created_at: string;
  name: string | null;
  phone: string | null;
  role: string | null;
};

const ViewRegistrations = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false }); // Sắp xếp theo ngày tạo mới nhất

      if (error) {
        console.error("Error fetching contacts:", error);
        setError("Không thể tải danh sách đăng ký. Vui lòng thử lại.");
      } else {
        setContacts(data || []);
      }

      setLoading(false);
    };

    fetchContacts();
  }, []);

  const renderLoadingState = () => (
    <div className="space-y-2">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  );

  const renderErrorState = () => (
    <Alert variant="destructive">
      <Terminal className="h-4 w-4" />
      <AlertTitle>Đã xảy ra lỗi</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );

  const renderDataTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Họ tên</TableHead>
          <TableHead>Số điện thoại</TableHead>
          <TableHead>Vai trò</TableHead>
          <TableHead className="text-right">Ngày đăng ký</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="font-medium">{contact.id}</TableCell>
              <TableCell>{contact.name || "N/A"}</TableCell>
              <TableCell>{contact.phone || "N/A"}</TableCell>
              <TableCell>{contact.role || "N/A"}</TableCell>
              <TableCell className="text-right">
                {new Date(contact.created_at).toLocaleDateString("vi-VN")}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              Chưa có ai đăng ký.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Danh sách đăng ký</CardTitle>
          <CardDescription>
            Dưới đây là danh sách tất cả những người đã đăng ký làm Speaker hoặc Mentor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading
            ? renderLoadingState()
            : error
            ? renderErrorState()
            : renderDataTable()}
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewRegistrations;