<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\OrganizationProfile;

class OrganizationProfileSeeder extends Seeder
{
    public function run(): void
    {
        OrganizationProfile::create([
            'name' => 'Organia',
            'visi' => 'Menjadi organisasi kader percontohan yang modern, transparan, dan berdaya guna tinggi bagi masyarakat.',
            'misi' => "1. Menerapkan manajemen digital di setiap level kepengurusan.\n2. Membangun kader yang tangguh dan adaptif.\n3. Memberikan kontribusi nyata dalam penyelesaian masalah sosial kemasyarakatan.",
            'sejarah' => 'Organia didirikan pada tahun 2026 sebagai wujud transformasi digital organisasi sayap kemasyarakatan yang sebelumnya dikelola secara tradisional.',
            'kontak' => 'halo@organia.id | (021) 555-0199',
            'is_public_page_active' => true,
        ]);
    }
}
