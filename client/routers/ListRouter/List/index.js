import { connect } from 'react-redux';

import List from './component';
import container from './container';

export default connect(container.mapStateToProps, container.matchDispatchToProps)(List);