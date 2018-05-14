import { connect } from 'react-redux';

import Calendar from './component';
import container from './container';

export default connect(container.mapStateToProps, container.matchDispatchToProps)(Calendar);