import VerticalMenu from '../vertical_menu';
import Dispatcher from '../streams/base_dispatcher';
import GenericTransform from '../streams/generic_transform';
import MenuTransform from '../streams/menu_transform';
import minimatch from 'minimatch';
import Page from '../page';
import path from 'path';
import Prompt from '../prompt';
import QueriesTransform from '../streams/queries_transform';
import { addFile, removeFile } from '../actions';
import { execSync } from 'child_process';

/**
 * Menu Options format
 *
 * @example
 * [
 *   {
 *     id: 1,
 *     label: 'directories',
 *     name: 'directories',
 *     value: 'directories'
 *   },
 *   // ...
 * ]
 */

/**
 * Changed Files Page
 * The files menu page of our CLI app
 *
 * @class FilesPage
 * @extends {Page}
 * @property {string} intro - Introduction text
 * @property {string} question - Prompt question
 */
export default class ChangedPage extends Page {

  question = 'Add files';

  /**
   * Constructor
   * Initializes this page's subclass
   *
   * @constructor
   * @param {object} props - Properties to initialize the class with
   */
  constructor (props) {
    super(props);
    this.menu = new VerticalMenu({
      canUnselect: true,
      acceptsMany: true,
      stdin: this.props.stdin,
      stdout: this.props.stdout,
      app: this.props.app
    });

    this.prompt = new Prompt({
      stdin: this.props.stdin,
      stdout: this.props.stdout
    });
  }

  /**
   * Get Initial State
   * Initializes this component's state
   *
   * @method
   * @public
   * @returns {object} Initial state properties
   */
  getInitialState () {
    return {
      files: this.getFiles(this.getGlob())
    };
  }

  /**
   * Create Options From
   * Takes our selected files and builds a menu options array
   *
   * @method
   * @public
   * @param {array} files - Array of filenames to make into options
   * @returns {array} Array of menu options
   */
  createOptionsFrom (files) {
    let selectedFiles = this.select('files'),
        basedir = this.getBasedir();

    return files.map((filename, i) => {
      return {
        id: i + 1,
        label: path.relative(basedir, filename),
        name: filename,
        value: filename,
        isSelected: selectedFiles.indexOf(filename) > -1
      };
    }) || [];
  }

  /**
   * Get Files
   * Returns an array of files to select
   *
   * @method
   * @public
   * @param {string} pattern - Glob pattern to filter against
   * @returns {array} Array of menu options
   */
  getFiles (pattern) {
    let basedir = this.getBasedir(),
        output = execSync('git diff --name-only'),
        files = output.toString().split('\n'),
        mm = new minimatch.Minimatch(pattern);

    if (!files.length) return [];

    return files.map((filename) => {
      return path.resolve(filename);
    })
    .filter((filename) => {
      return mm.match(filename) && filename.indexOf(basedir) > -1;
    });
  }

  /**
   * Show Prompt
   * Beckons the prompt
   *
   * @method
   * @public
   * @returns {Stream} A duplex stream for processing the found files
   */
  showPrompt () {
    return this.prompt.beckon(this.question)
      .pipe(new GenericTransform((stream, transformAction) => {
        if (this.menu.options().length) return stream.push(transformAction);

        stream.pushError(new Error('No git tracked files have changed since last commit.'));
      }))
      .pipe(new QueriesTransform())
      .pipe(new MenuTransform({
        choices: this.menu.options()
      }))
      .pipe(new Dispatcher({
        store: this.props.store
      }))
      .then(this.reprompt);
  }

  renderMenu () {
    this.menu.setOptions(this.createOptionsFrom(this.state.files));
    return this.menu.render();
  }

  renderPrompt () {
    return this.showPrompt;
  }
}
