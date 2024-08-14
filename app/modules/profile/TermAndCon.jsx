import { Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native'
import { StyleSheet } from 'react-native'

const TermAndCon = () => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.title}>Syarat dan Ketentuan</Text>
                <Text style={styles.paragraph}>
                    Perjanjian Layanan ini (selanjutnya disebut sebagai “Perjanjian”) merupakan perjanjian yang mengikat dan sah antara Sahabat Seller, suatu perusahaan yang didirikan dan tunduk terhadap hukum Negara Kesatuan Republik Indonesia (selanjutnya dapat disebut sebagai “Sahabat Seller” atau “Kami”) dengan Anda, yang merujuk kepada pelaku usaha, termasuk afiliasinya dalam bentuk perseorangan atau individu, badan hukum dan/atau non-badan hukum (selanjutnya dapat disebut sebagai “Anda” atau “Pengguna”) yang menggunakan Layanan (sebagaimana didefinisikan di bawah ini) dan menyetujui untuk tunduk pada syarat dan ketentuan Perjanjian ini. Kami memiliki website dengan alamat URL: https://sahabatseller.my.id dan aplikasi sistem dagang berbasis daring dengan model Point of Sales (POS) (“Aplikasi”) dengan nama merek dagang “Sahabat Seller”, yang memiliki fungsi untuk memudahkan pelaku usaha dalam menjalankan usahanya dengan merekap hasil penjualan, mengawasi stok barang, membuat laporan penjualan, mengelola karyawan dan layanan - layanan yang dapat ditambahkan dari waktu ke waktu dan layanan aplikasi lainnya yang Kami sediakan dan kelola (“Layanan”).
                    Anda yang telah mengunduh, memasang, dan/atau menggunakan Layanan, maka dengan ini Anda menyatakan persetujuan Anda terhadap segala syarat dan ketentuan yang ditetapkan dalam Perjanjian ini. Anda menyatakan telah membaca, memahami, menerima dan menyetujui seluruh isi Perjanjian ini yang merupakan suatu perjanjian bersifat secara perdata. Apabila Anda tidak menyetujui isi dari Perjanjian, maka silakan Anda berhenti untuk menggunakan Layanan.
                    Persetujuan atas Perjanjian ini juga termasuk persetujuan Anda terhadap setiap penambahan, modifikasi, dan segala perubahan isi dari syarat dan ketentuan Perjanjian ini, termasuk apabila terdapat syarat dan ketentuan lainnya yang terdapat pada layanan tambahan, berlaku sepanjang Anda mengakses dan menggunakan Layanan tambahan tersebut (“Perjanjian Tambahan Lain”). Syarat dan ketentuan yang terdapat dalam Perjanjian Tambahan Lain merupakan satu kesatuan yang tidak terpisahkan dengan Perjanjian. Namun demikian, ketentuan pada Perjanjian Tambahan Lain dapat ditentukan berbeda sepanjang secara tegas dinyatakan di dalamnya. Oleh karenanya, Kami menyarankan kepada Anda untuk selalu membaca secara berkala terhadap isi Perjanjian ini dan Perjanjian Tambahan Lain, jika ada.
                    KAMI MENYARANKAN ANDA UNTUK MEMERIKSA SEGALA ISI SYARAT DAN KETENTUAN PERJANJIAN DENGAN SEKSAMA SEBELUM MENGGUNAKAN LAYANAN KAMI. KETENTUAN YANG TERDAPAT DALAM PERJANJIAN INI MUNGKIN TERDAPAT PEMBATASAN-PEMBATASAN YANG HARUS ANDA PATUHI SELAMA MENGAKSES DAN/ATAU MENGGUNAKAN LAYANAN. KAMI AKAN MENYEDIAKAN KEPADA ANDA UNTUK PERTAMA KALINYA PERJANJIAN INI SEBELUM ANDA MENGGUNAKAN LAYANAN AGAR DAPAT DIPAHAMI. JIKA KETENTUAN PERJANJIAN INI DIBERITAHUKAN KEPADA ANDA SETELAH ANDA TERLEBIH DAHULU MENGGUNAKAN LAYANAN, MAKA KETENTUAN INI AKAN BERLAKU KEPADA ANDA PADA SAAT SAAT ITU DAN AKAN BERLAKU SETERUSNYA SELAMA ANDA MENGGUNAKAN LAYANAN KAMI. PERSETUJUAN ANDA ATAS PERJANJIAN INI DAPAT BERUPA PEMBERIAN CENTANG SEBAGAIMANA DITENTUKAN DALAM APLIKASI ATAU DAPAT BERUPA PERSETUJUAN ANDA DENGAN MELANJUTKAN MENGGUNAKAN LAYANAN.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.subTitle}>1. PERSETUJUAN</Text>
                <Text style={styles.subTitle}>1.1. Persetujuan Kami</Text>
                <Text style={styles.paragraph}>
                    Kami memberikan persetujuan penggunaan kepada Anda untuk dapat menggunakan Layanan dengan tunduk pada syarat dan ketentuan Perjanjian ini dan/atau Perjanjian Tambahan Lain. Persetujuan penggunaan ini diberikan kepada Anda secara non-eksklusif (Non-Exclusive), tidak dapat dialihkan (Non-Transferable), dan hanya ditujukan kepada Anda sesuai dengan penggunaan Anda untuk kelancaran bisnis atau usaha atau sebagaimana tujuan Anda untuk menggunakan Layanan. Kami menyediakan Layanan kepada Anda “Sebagaimana Adanya”, yang berarti penggunaannya tidak memberikan jaminan atau pernyataan dari Kami, kecuali jika memang secara tegas telah Kami berikan pernyataan dalam Perjanjian ini dan/atau Perjanjian Tambahan Lain.
                </Text>
                <Text style={styles.subTitle}>1.2. Persetujuan Anda</Text>
                <Text style={styles.paragraph}>
                    Anda menyatakan kepada Kami bahwa Anda memberikan persetujuan Anda untuk menggunakan Layanan tanpa adanya paksaan dari pihak mana pun. Pilihan untuk menggunakan Layanan kami merupakan pilihan Anda sendiri. Anda dapat kapan pun, berhenti menggunakan Layanan atau menangguhkan penggunaan Anda atas Layanan. Sepanjang diizinkan dalam Perjanjian ini, Anda juga dapat memberikan masukan-masukan terhadap Layanan seperti berupa termasuk namun tidak termasuk pada penambahan fitur, modul, UI/UX dengan tujuan agar pengalaman penggunaan atas Layanan dapat berkembang dan menjadi lebih baik. Kami akan menerima masukan tersebut dengan senang hati, namun persetujuan untuk menerapkan atas masukan tersebut merupakan hak dan wewenang kami sepenuhnya.
                </Text>

                <Text style={styles.subTitle}>2. LAYANAN</Text>
                <Text style={styles.subTitle}>2.1. Layanan Versi Gratis</Text>
                <Text style={styles.paragraph}>
                    Kami menyediakan kepada Anda Layanan yang dapat Anda gunakan secara gratis. Penggunaan atas Layanan versi gratis ini memberikan batasan-batasan tertentu selama Anda menggunakan Layanan. Tidak ada pernyataan jaminan yang kami berikan kepada Anda atas penggunaan Layanan versi gratis, selain daripada fitur-fitur yang terdapat di dalamnya dan apa adanya. Anda dapat menggunakan Layanan versi gratis sepanjang disediakan oleh Kami. Namun, Kami tidak memberikan jaminan apapun kepada Anda bahwa Layanan tersebut akan sesuai dan mengakomodir kebutuhan bisnis atau usaha Anda.
                </Text>
                <Text style={styles.subTitle}>2.2. Layanan Versi Berbayar</Text>
                <Text style={styles.paragraph}>
                    Kami menyediakan kepada Anda berbagai Layanan versi berbayar yang dapat Anda beli sesuai dengan kebutuhan bisnis atau usaha Anda.</Text>

                <Text style={styles.subTitle}>3. BIAYA DAN PEMBAYARAN</Text>
                <Text style={styles.paragraph}>
                    Anda tidak akan dibebankan biaya dan diwajibkan melakukan pembayaran kepada Kami ketika Anda mengunduh serta menggunakan Layanan versi gratis. Pembebanan atas biaya dan kewajiban melakukan pembayaran kepada Kami, tunduk pada syarat dan ketentuan serta pilihan Anda untuk menggunakan Layanan versi berbayar tersebut. Kami berhak untuk menetapkan dan membebankan biaya tertentu serta mekanisme pembayaran dari waktu ke waktu atas penggunaan Anda pada Layanan versi berbayar. Ketentuan ini akan tunduk pada syarat dan ketentuan peraturan perundang-undangan berlaku, seperti peraturan mengenai pajak, mata uang, perdagangan nasional atau internasional, dan peraturan berlaku lainnya.
                    Anda akan melakukan pembayaran sejumlah biaya tertentu dengan mekanisme pembayaran yang telah Kami sediakan di formulir pemesanan Anda pada saat Anda menyetujui untuk melakukan pembelian atau akses untuk Layanan versi berbayar. Jika tidak ditentukan lain, Anda harus membayar biaya kepada Kami dalam waktu 14 (empat belas) hari kalender dari tanggal tagihan (invoice) atau formulir pemesanan yang sah. Kecuali ditentukan lain, akses atas Layanan berbayar, termasuk fitur-fitur dan modul dan fungsi hanya akan aktif setelah Kami berhasil menerima pembayaran sejumlah biaya sesuai dengan biaya yang seharusnya diterima.
                </Text>

                <Text style={styles.subTitle}>4. PEMBATASAN-PEMBATASAN</Text>
                <Text style={styles.paragraph}>
                    Kami berusaha menyediakan kepada Anda Layanan untuk dapat Anda Akses dalam waktu 24 (dua puluh empat) jam dalam sehari. Apabila terdapat kecacatan (bug) selama menggunakan Aplikasi, Anda dapat memberitahu dan memintakan perbaikan kepada Kami. Kami sewaktu-waktu akan memberitahukan kepada Anda jika terdapat pemeliharaan secara berkala atau secara tidak terjadwal atas layanan Aplikasi.
                    Kami tidak menjamin bahwa Layanan yang Kami berikan akan sesuai dengan tujuan penggunaan terhadap usaha atau bisnis Anda. Kami menyarankan kepada Anda untuk mencari tahu terlebih dahulu mana layanan yang relevan dan sesuai supaya pada saat Anda menggunakan Layanan, maka dapat mengarah dan sesuai dengan tujuan penggunaan Anda. Anda setuju dan sadar bahwa Anda memanfaatkan Layanan atas risiko Anda sendiri, dan Layanan yang diberikan kepada Anda dengan sebagaimana mestinya dan sebagaimana tersedia.
                    Kami akan terus berupaya untuk menjaga kualitas Layanan untuk tetap aman, nyaman, dan berfungsi dengan baik, namun Kami tidak dapat menjamin operasional terus-menerus atau akses terhadap Aplikasi dan/atau Layanan dapat selalu sempurna. Kecuali ditentukan lain, Informasi dan data dalam Layanan memiliki kemungkinan tidak terjadi secara real time.
                    Sejauh diizinkan oleh hukum yang berlaku, Kami (termasuk perusahaan terafiliasi, direktur, komisaris, pejabat, serta seluruh karyawan dan agen) tidak bertanggung jawab, dan Anda setuju untuk tidak menuntut Kami agar bertanggung jawab atas segala kerusakan atau kerugian (termasuk namun tidak terbatas pada hilangnya uang, reputasi, keuntungan, atau kerugian tak berwujud lainnya) yang diakibatkan secara langsung atau tidak langsung.
                </Text>

                <Text style={styles.subTitle}>5. JANGKA WAKTU PERJANJIAN</Text>
                <Text style={styles.paragraph}>
                    Perjanjian ini akan berlaku selama Anda secara terus menerus menggunakan Layanan kami. Namun demikian, Kami dapat mengakhiri syarat dan ketentuan Perjanjian ini apabila i) Anda melanggar syarat dan ketentuan Perjanjian ini dan tidak dapat diperbaiki; ii) Anda secara sengaja telah melanggar hak kekayaan intelektual milik pihak ketiga; iii) penggunaan Anda atas Layanan dilakukan secara melanggar hukum atau tidak sah; dan/atau iv) Anda berada dalam proses permohonan pailit dan penetapan di pengadilan, baik diajukan oleh Anda sendiri atau oleh pihak ketiga.
                </Text>

                <Text style={styles.subTitle}>6. PENGELOLAAN DATA DAN KEBIJAKAN PRIVASI</Text>
                <Text style={styles.paragraph}>
                    Dengan mengakses dan/atau menggunakan Layanan, Anda setuju untuk berbagi data, termasuk data pribadi Anda kepada Kami. Anda dengan ini menyetujui syarat dan ketentuan atas kebijakan berbagi data selama menggunakan Layanan sebagaimana ditetapkan pada Kebijakan Privasi ini.
                    Kami menyarankan kepada Anda agar Anda membaca dan memahami Kebijakan Privasi tersebut supaya Anda mengetahui bagaimana cara kami mengelola data Anda, termasuk atas data pribadi Anda atau data pribadi pihak ketiga yang anda berikan.
                </Text>

                <Text style={styles.subTitle}>7. HAK KEKAYAAN INTELEKTUAL</Text>
                <Text style={styles.paragraph}>
                    Layanan dan aplikasi yang disediakan kepada Anda, termasuk namun tidak terbatas pada nama, logo, merek dagang, rahasia dagang, informasi, gambar, kode sumber (source code), basis data (database), dan teknologi merupakan properti, hak cipta, informasi rahasia dan/atau hak kekayaan intelektual (selanjutnya disebut dengan“HKI”) Kami. Anda tidak diperkenankan untuk menyalin secara tidak sah dan/atau menggunakannya secara melawan hukum tanpa izin dari Kami. Selama menggunakan Aplikasi dan/atau Layanan, Anda berkewajiban untuk menjaga secara wajar atas HKI Kami dan akan memberikan informasi serta pemberitahuan apabila Anda menyadari dan mengetahui telah terdapat pelanggaran atas HKI. Kami berhak untuk mempertahankan secara hukum apabila terdapat pelanggaran atas HKI Kami tersebut.
                    Ketentuan dalam Perjanjian ini secara tegas menyatakan bahwa Anda dilarang untuk membalikan rakitan (reverse assemble), membalikkan kompilasi (reverse compile) dan/atau merekayasa balik (reverse engineering) Aplikasi dan/atau Layanan secara sebagian atau keseluruhan. Pelanggaran atas ketentuan ini merupakan pelanggaran material atas Perjanjian ini.
                </Text>

                <Text style={styles.subTitle}>8. LAYANAN PIHAK KETIGA</Text>
                <Text style={styles.paragraph}>
                    Layanan yang kami sediakan kepada Anda, kemungkinan juga terdapat Layanan dari pihak ketiga sebagaimana sesuai dengan kerja sama bisnis Kami dengan pihak ketiga tersebut. Anda menyetujui bahwa penggunaan atas layanan dari pihak ketiga akan tunduk pada syarat dan ketentuan layanan dari pihak ketiga tersebut. Oleh karenanya, Sejauh diizinkan oleh hukum yang berlaku, Kami (termasuk perusahaan terafiliasi, direktur, komisaris, pejabat, serta seluruh karyawan dan agen) tidak bertanggung jawab, dan Anda setuju untuk tidak menuntut Kami agar bertanggung jawab atas segala kerusakan atau kerugian yang disebabkan oleh kegagalan dari layanan pihak ketiga tersebut.
                </Text>

                <Text style={styles.subTitle}>9. PILIHAN HUKUM DAN PENYELESAIAN PERSELISIHAN</Text>
                <Text style={styles.paragraph}>
                    Perjanjian ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia, tanpa memperhatikan pertentangan aturan hukum. Anda setuju bahwa tindakan hukum apapun atau sengketa yang mungkin timbul dari, berhubungan dengan, atau berada dalam cara apapun berhubungan dengan Layanan dan/atau syarat dan ketentuan ini akan diselesaikan secara eksklusif melalui BANI (Badan Arbitrase Nasional Indonesia).
                </Text>

                <Text style={styles.subTitle}>10. PERUBAHAN</Text>
                <Text style={styles.paragraph}>
                    Kami memiliki hak untuk melakukan pembaruan dan/atau perubahan ketentuan Perjanjian ini dari waktu ke waktu jika diperlukan demi keamanan dan kenyamanan penggunaan Layanan. Anda dengan ini setuju bahwa Anda bertanggung jawab untuk membaca secara saksama dan memeriksa Ketentuan Layanan ini dari waktu ke waktu untuk mengetahui pembaruan dan/atau perubahan apapun. Dengan tetap mengakses dan menggunakan Layanan, maka Anda dianggap menyetujui pembaruan dan/atau perubahan dalam Ketentuan Layanan ini.
                </Text>


            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#ffffff',
    },
    section: {
        marginBottom: 0,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 10,
        textAlign: 'justify',
    },
    point: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'justify',
        marginLeft: 15,
    },
});


export default TermAndCon
