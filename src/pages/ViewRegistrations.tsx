import { useEffect, useState, useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Users, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { showSuccess, showError } from "@/utils/toast";

// Định nghĩa kiểu dữ liệu cho một liên hệ, bao gồm cả trường trạng thái mới
type Contact = {
  id: number;
  created_at: string;
  name: string | null;
  phone: string | null;
  role: string | null;
  status: string | null;
};

const ViewRegistrations = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching contacts:", error);
      setError("Không thể tải danh sách đăng ký. Vui lòng thử lại.");
    } else {
      setContacts(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Tính toán thống kê số người đã và chưa liên hệ
  const stats = useMemo(() => {
    const notContacted = contacts.filter(c => c.status !== 'Đã liên hệ').length;
    const contacted = contacts.filter(c => c.status === 'Đã liên hệ').length;
    return { notContacted, contacted, total: contacts.length };
  }, [contacts]);

  // Xử lý việc thay đổi trạng thái của một liên hệ
  const handleStatusChange = async (id: number, newStatus: string) => {
    // Cập nhật giao diện ngay lập tức để có trải nghiệm tốt hơn
    setContacts(currentContacts =>
      currentContacts.map(contact =>
        contact.id === id ? { ...contact, status: newStatus } : contact
      )
    );

    const { error } = await supabase
      .from('contacts')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      showError('Cập nhật trạng thái thất bại!');
      // Tải lại dữ liệu từ server nếu có lỗi để đảm bảo tính nhất quán
      fetchContacts();
    } else {
      showSuccess('Cập nhật trạng thái thành công!');
    }
  };

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
          <TableHead>Họ tên</TableHead>
          <TableHead>Số điện thoại</TableHead>
          <TableHead>Vai trò</TableHead>
          <TableHead>Ngày đăng ký</TableHead>
          <TableHead className="text-center">Trạng thái</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="font-medium">{contact.name || "N/A"}</TableCell>
              <TableCell>{contact.phone || "N/A"}</TableCell>
              <TableCell>{contact.role || "N/A"}</TableCell>
              <TableCell>
                {new Date(contact.created_at).toLocaleDateString("vi-VN")}
              </TableCell>
              <TableCell>
                <Select
                  value={contact.status || 'Chưa liên hệ'}
                  onValueChange={(newStatus) => handleStatusChange(contact.id, newStatus)}
                >
                  <SelectTrigger className={cn(
                      "w-[150px] mx-auto",
                      contact.status === 'Đã liên hệ' 
                        ? "text-green-700 border-green-300 bg-green-50" 
                        : "text-red-700 border-red-300 bg-red-50"
                  )}>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chưa liên hệ">Chưa liên hệ</SelectItem>
                    <SelectItem value="Đã liên hệ">Đã liên hệ</SelectItem>
                  </SelectContent>
                </Select>
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
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <CardTitle className="text-2xl">Danh sách đăng ký</CardTitle>
              <CardDescription>
                Quản lý và theo dõi trạng thái liên hệ của các Speaker và Mentor.
              </CardDescription>
            </div>
            <div className="flex gap-4 text-sm border rounded-lg p-3 bg-muted/50">
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="text-muted-foreground">Tổng số</p>
                        <p className="font-bold text-lg">{stats.total}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <div>
                        <p className="text-muted-foreground">Chưa liên hệ</p>
                        <p className="font-bold text-lg text-red-500">{stats.notContacted}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                        <p className="text-muted-foreground">Đã liên hệ</p>
                        <p className="font-bold text-lg text-green-500">{stats.contacted}</p>
                    </div>
                </div>
            </div>
          </div>
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