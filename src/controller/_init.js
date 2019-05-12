module.exports = app => {
    app.data = {
        todayViews: 0,
        allViews: 0,
        logo: '/img/favicon.png',
        footer: '/img/footer.jpg',
        map: '/img/map.jpg',
        facebook: 'https://www.facebook.com/cse.hcmut',
        youtube: '',
        twitter: '',
        instagram: '',
        headerText: 'Chúc mừng tân trưởng khoa',
        headerImage: '/img/home.jpg',
        latitude: 10.7744962,
        longitude: 106.6606518,
        email: app.email.from, //fas@hcmut.edu.vn
        emailPassword: app.email.password,
        mobile: '(08) 2214 6555',
        address: 'Nhà A3 - Trường Đại học Bách Khoa - ĐHQG HCM | 268 Lý Thường Kiệt, P.14, Q.10',
        hotNewsActive: false,
        hotNewsTitle: '',
        hotNewsUrl: '#',
        hotNewsDescription: '',
        hotNewsImage: '',
        conferences: [],
    };

    // Count views --------------------------------------------------------------------------------
    app.model.setting.init(app.data, () =>
        app.model.setting.get(['todayViews', 'allViews', 'logo', 'footer', 'map', 'facebook', 'youtube', 'twitter', 'instagram', 'headerText', 'headerImage', 'latitude', 'longitude', 'email', 'emailPassword', 'mobile', 'address', 'hotNewsActive', 'hotNewsTitle', 'hotNewsUrl', 'hotNewsDescription', 'hotNewsImage'], result => {
            app.data.todayViews = parseInt(result.todayViews);
            app.data.allViews = parseInt(result.allViews);
            app.data.logo = result.logo;
            app.data.footer = result.footer;
            app.data.map = result.map;
            app.data.facebook = result.facebook;
            app.data.youtube = result.youtube;
            app.data.twitter = result.twitter;
            app.data.instagram = result.instagram;
            app.data.headerText = result.headerText;
            app.data.headerImage = result.headerImage;
            app.data.latitude = result.latitude;
            app.data.longitude = result.longitude;
            app.data.email = result.email;
            app.data.emailPassword = result.emailPassword;
            app.data.mobile = result.mobile;
            app.data.address = result.address;
            app.data.hotNewsActive = result.hotNewsActive;
            app.data.hotNewsTitle = result.hotNewsTitle;
            app.data.hotNewsUrl = result.hotNewsUrl;
            app.data.hotNewsDescription = result.hotNewsDescription;
            app.data.hotNewsImage = result.hotNewsImage
        }));

    app.model.user.count((error, numberOfUser) => {
        app.data.numberOfUser = error ? 0 : numberOfUser;

        app.model.news.count((error, numberOfNews) => {
            app.data.numberOfNews = error ? 0 : numberOfNews;

        });
    });

    const fiveMinuteJob = () => {
        const count = {
            todayViews: app.data.todayViews,
            allViews: app.data.allViews
        }
        app.io.emit('count', count);
        app.model.setting.set(count);
    };
    app.schedule('0 * * * *', fiveMinuteJob);
    app.schedule('5 * * * *', fiveMinuteJob);
    app.schedule('10 * * * *', fiveMinuteJob);
    app.schedule('15 * * * *', fiveMinuteJob);
    app.schedule('20 * * * *', fiveMinuteJob);
    app.schedule('25 * * * *', fiveMinuteJob);
    app.schedule('30 * * * *', fiveMinuteJob);
    app.schedule('35 * * * *', fiveMinuteJob);
    app.schedule('40 * * * *', fiveMinuteJob);
    app.schedule('45 * * * *', fiveMinuteJob);
    app.schedule('50 * * * *', fiveMinuteJob);
    app.schedule('55 * * * *', fiveMinuteJob);

    app.schedule('0 0 * * *', () => app.data.todayViews = 0);

    // Menu ---------------------------------------------------------------------------------------
    app.model.menu.getByLink('/', (error, menu) => {
        if (error) {
            console.error('Get menu by link has errors!');
        } else if (menu == null) {
            app.model.menu.create({
                active: true,
                title: 'home',
                link: '/',
            });
        }
    });

    // Email --------------------------------------------------------------------------------------
    app.model.setting.init({
        emailRegisterMemberTitle: 'FAS: Chào mừng thành viên mới!',
        emailRegisterMemberText: 'Xin chào {name}, Trung tâm Hỗ trợ sinh viên và việc làm (FAS) chào mừng bạn là thành viên mới. Trước khi bạn có thể đăng nhập, bạn vui lòng kích hoạt tài khoản bằng cách nhấp vào  {url}. Trân trọng, Trung tâm Hỗ trợ sinh viên và việc làm (FAS), Website: http://cse.hcmut.edu.vn',
        emailRegisterMemberHtml: 'Xin chào <b>{name}</b>,<br/><br/>' +
            'Trung tâm Hỗ trợ sinh viên và việc làm (FAS) chào mừng bạn là thành viên mới. Trước khi bạn có thể đăng nhập, bạn vui lòng kích hoạt tài khoản bằng cách nhấp vào link <a href="{url}">{url}</a>.<br/><br/>' +
            'Trân trọng,<br/>' +
            'Trung tâm Hỗ trợ sinh viên và việc làm (FAS)<br/>' +
            'Website: <a href="http://cse.hcmut.edu.vn">http://cse.hcmut.edu.vn</a>',
        emailCreateMemberByAdminTitle: 'FAS: Chào mừng thành viên mới!',
        emailCreateMemberByAdminText: 'Chào {name}, Tài khoản của bạn đã được tạo. Thông tin đăng nhập của bạn là: email: {email}. Mật khẩu: "{password}". Link kích hoạt: {url}. Trân trọng, FAS Admin.',
        emailCreateMemberByAdminHtml: 'Chào {name},<br/><br/>Tài khoản của bạn đã được tạo. Thông tin đăng nhập của bạn là: <br> - Email: {email}.<br> - Mật khẩu: "{password}".<br/> - Link kích hoạt: <a href="{url}">{url}</a>.<br/><br/>Trân trọng,<br/>FAS Admin.',
        emailNewPasswordTitle: 'FAS: Mật khẩu mới!',
        emailNewPasswordText: 'Chào {name}, Mật khẩu mới của bạn là "{password}". Trân trọng, FAS Admin.',
        emailNewPasswordHtml: 'Chào {name},<br/><br/>Mật khẩu mới của bạn là "<b>{password}</b>".<br/><br/>Trân trọng,<br/>FAS Admin.',
        emailForgotPasswordTitle: 'FAS: Quên mật khẩu!',
        emailForgotPasswordText: 'Chào {name}, Bạn vừa mới yếu cầu thay đổi mật khẩu tại trang web http://cse.hcmut.edu.vn. ' +
            'Bạn dùng đường link bên dưới để thay đổi mật khẩu. ' +
            'Mật khẩu chỉ có hiệu lực trong 24 giờ kế tiếp. ' +
            'Link: {url}' +
            'Trân trọng, ' +
            'Trung tâm Hỗ trợ sinh viên và việc làm (FAS)' +
            'Website: http://cse.hcmut.edu.vn',
        emailForgotPasswordHtml: '<p><b>Chào {name}, </b><br/><br/>Bạn vừa mới yếu cầu thay đổi mật khẩu tại trang web <a href="http://cse.hcmut.edu.vn" target="_blank">http://cse.hcmut.edu.vn</a>. ' +
            'Bạn dùng đường link bên dưới để thay đổi mật khẩu. <b>Đường link bên dưới chỉ có hiệu lực trong 24 giờ tiếp theo.</b><br/>' +
            'Link: <a href="{url}">{url}</a><br/>' +
            'Trân trọng, <br/>' +
            'Trung tâm Hỗ trợ sinh viên và việc làm (FAS)<br/>' +
            'Website: <a href="http://cse.hcmut.edu.vn" target="_blank">http://cse.hcmut.edu.vn</a></p>',
        emailContactTitle: 'FAS: Liên hệ',
        emailContactText: 'Chào bạn, FAS đã nhận tin nhắn của bạn. Cảm ơn bạn đã liên hệ với chúng tôi. Tiêu đề liên hệ là: "{title}". Thông điệp của bạn là: "{message}". FAS sẽ trả lời bạn sớm nhất. Trân trọng, FAS admin.',
        emailContactHtml: 'Chào bạn,<br/><br/>FAS đã nhận tin nhắn của bạn. Cảm ơn bạn đã liên hệ với chúng tôi.<br/>Tiêu đề liên hệ là: "{title}".<br/>Thông điệp của bạn là: "{message}".<br/>FAS sẽ trả lời bạn sớm nhất.<br/><br/>Trân trọng,<br/>FAS admin.',
    });
};