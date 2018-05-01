import config from './../config.js';
import Base_tools_class from './../core/base-tools.js';
import File_search_json_class from './../modules/file/syntaxnet.js';

class Media_class extends Base_tools_class {

	constructor(ctx) {
		super();
		this.Seach = new File_search_json_class();
		this.name = 'media2';
	}

	load() {
		//nothing
	}

	render(ctx, layer) {
		//nothing
	}

	on_activate() {
		this.Seach.search();
	}
}
;
export default Media_class;
