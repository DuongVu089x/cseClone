import React from 'react';
import SectionCarousel from './SectionCarousel.jsx';
import SectionHot from './SectionHot.jsx';
import SectionSlogan from './SectionSlogan.jsx';
import SectionVideo from './SectionVideo.jsx';
import SectionStatistic from './SectionStatistic.jsx';
import SectionTestimony from './SectionTestimony.jsx';
import SectionStaffGroup from './SectionStaffGroup.jsx';
import SectionDivision from './SectionDivision.jsx';
import SectionNews from './SectionNews.jsx';
import SectionSubscribe from './SectionSubscribe.jsx';
import SectionContact from './SectionContact.jsx';
import LogoCarousel from './LogoCarousel.jsx';
import NewsListView from './NewsListView.jsx';

export default class MenuPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { component: null };
    }

    componentDidMount() {
        const url = '/menu';
        T.post(url, { link: window.location.pathname }, res => {
            if (res.error) {
                this.props.history.push('/');
            } else {
                this.setState({ component: res });
            }
        });
    }

    renderComponents(index, ins, outs) {
        if (index < ins.length) {
            let item = ins[index],
                itemView = null,
                itemStyle = null;
            try { itemStyle = JSON.parse('{' + item.style + '}') } catch { }
            if (item.viewType == 'carousel') {
                itemView = <SectionCarousel viewId={item.viewId} />;
            } else if (item.viewType == 'hot') {
                itemView = <SectionHot />;
            } else if (item.viewType == 'slogan') {
                itemView = <SectionSlogan sloganId={item.viewId} />;
            } else if (item.viewType == 'video') {
                itemView = <SectionVideo videoId={item.viewId} />;
            } else if (item.viewType == 'statistic') {
                itemView = <SectionStatistic statisticId={item.viewId} />;
            } else if (item.viewType == 'staff group') {
                itemView = <SectionStaffGroup staffGroupId={item.viewId} />;
            } else if (item.viewType == 'testimony') {
                itemView = <SectionTestimony testimonyId={item.viewId} />;
            } else if (item.viewType == 'all divisions') {
                itemView = <SectionDivision />;
            } else if (item.viewType == 'last news') {
                itemView = <SectionNews />;
            } else if (item.viewType == 'subscribe') {
                itemView = <SectionSubscribe />;
            } else if (item.viewType == 'contact') {
                itemView = <SectionContact />;
            } else if (item.viewType == 'content' && item.view) {
                itemView = <div dangerouslySetInnerHTML={{ __html: item.view.content }} />;
            } else if (item.viewType == 'all news') {
                itemView = <NewsListView />;
            } else if (item.viewType == 'news') {
                itemView = 'TODO: news';
            }

            let childComponents = [];
            if (item.components) {
                this.renderComponents(0, item.components, childComponents);
            }

            outs.push(
                <div key={index} className={item.className} style={itemStyle}>
                    {itemView}
                    {childComponents}
                </div>
            );
            outs.push(this.renderComponents(index + 1, ins, outs));
        }
    }

    render() {
        let components = [];
        if (this.state.component) {
            this.renderComponents(0, [this.state.component], components);
        }
        return components;
    }
}