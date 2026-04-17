interface Props {
  page: number;
  limit: number;
  total: number;
}

export default function ProductResultInfo({ page, limit, total }: Props) {
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <p className='text-muted-foreground text-md'>
      Hiển thị {from}–{to} trong {total} sản phẩm
    </p>
  );
}
