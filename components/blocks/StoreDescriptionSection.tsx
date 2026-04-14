import { Card } from '../ui/card';

export default function StoreDescriptionSection() {
  return (
    <section className='mt-6'>
      <Card className='bg-muted/50 border-b p-6'>
        <p className='text-primary mb-3 text-sm'>
          Văn phòng phẩm giá rẻ <span className='text-muted-foreground'>chính hãng</span>
        </p>

        <h2 className='mb-3 text-3xl font-bold tracking-tight'>Văn Phòng Phẩm Minaco</h2>

        <div className='space-y-5 text-base leading-8'>
          <p>
            Tiền thân là <span className='text-primary font-semibold'>Cửa hàng văn phòng phẩm Minaco</span> được thành
            lập từ năm 2008 tại phố Hạ Đình - Thanh Xuân - Hà Nội, đến nay, với hơn 15 năm hình thành và phát triển, đội
            ngũ Minaco đã và đang làm hài lòng hàng ngàn Quý khách hàng và Quý đối tác trên toàn quốc.
          </p>

          <p>
            Với lợi thế từ hệ sinh thái vật tư doanh nghiệp{' '}
            <span className='font-semibold'>All in One - Minaco.vn</span> - VPP Minaco đã và đang mang đến những lợi thế
            cực kỳ hấp dẫn cho khối Doanh nghiệp - Cơ quan - Khu công nghiệp khi tìm kiếm và lựa chọn nhà cung cấp vật
            tư cho đơn vị mình:
          </p>

          <ul className='list-disc space-y-3 pl-6'>
            <li>
              Cung ứng trọn bộ vật tư với hơn <span className='font-semibold'>10.000 sản phẩm</span>
            </li>
            <li>Tối ưu tới 20% chi phí vật tư văn phòng định kỳ</li>
            <li>Miễn phí vận chuyển đơn hàng từ 499K</li>
            <li>Cam kết chất lượng, chính hãng đúng yêu cầu</li>
            <li>Cam kết giấy tờ, VAT đầy đủ</li>
            <li>Linh hoạt thanh toán và đổi trả tới 30 ngày</li>
          </ul>

          <p>
            Với mong muốn <span className='font-semibold'>cung cấp văn phòng phẩm giá tốt nhất</span>, nhanh nhất đi
            cùng chất lượng dịch vụ chuyên nghiệp và thân thiện nhất.
          </p>

          <p className='text-muted-foreground pt-4 text-sm font-medium italic'>
            # văn phòng phẩm chính hãng, văn phòng phẩm giá tốt nhất, văn phòng phẩm trọn gói...
          </p>
        </div>
      </Card>
    </section>
  );
}
