import { IOption } from 'erxes-ui/lib/types';
import Button from 'modules/common/components/Button';
import CollapseContent from 'modules/common/components/CollapseContent';
import FormControl from 'modules/common/components/form/Control';
import FormGroup from 'modules/common/components/form/Group';
import ControlLabel from 'modules/common/components/form/Label';
import Icon from 'modules/common/components/Icon';
import { FlexItem } from 'modules/common/components/step/styles';
import Toggle from 'modules/common/components/Toggle';
import { __ } from 'modules/common/utils';
import { Divider } from 'modules/settings/permissions/styles';
import SelectProperty from 'modules/settings/properties/containers/SelectProperty';
import { IField, IFieldLogic } from 'modules/settings/properties/types';
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import {
  FlexRow,
  LeftSection,
  Preview,
  PreviewSection,
  ShowPreview
} from '../styles';
import FieldLogics from './FieldLogics';
import FieldPreview from './FieldPreview';

type Props = {
  onSubmit: (field: IField) => void;
  onDelete: (field: IField) => void;
  onCancel: () => void;
  mode: 'create' | 'update';
  field: IField;
  fields: IField[];
  type: string;
};

type State = {
  field: IField;
  selectedOption?: IOption;
};

class FieldForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { field } = props;
    const selectedOption = field.associatedField && {
      value: field.associatedField._id,
      label: field.associatedField.text
    };

    this.state = {
      field,
      selectedOption
    };
  }

  onFieldChange = (
    name: string,
    value: string | boolean | string[] | IFieldLogic[]
  ) => {
    this.setFieldAttrChanges(name, value);
  };

  onPropertyChange = (selectedField: IField) => {
    const { field } = this.state;

    field.associatedFieldId = selectedField._id;
    field.validation = selectedField.validation;
    field.options = selectedField.options;
    field.type = selectedField.type;
    field.isRequired = selectedField.isRequired;
    field.text = selectedField.text;
    field.description = selectedField.description;

    this.setState({
      field,
      selectedOption: {
        value: selectedField._id,
        label: selectedField.text || ''
      }
    });
  };

  onSubmit = e => {
    e.persist();

    this.props.onSubmit(this.state.field);
  };

  setFieldAttrChanges(
    attributeName: string,
    value: string | boolean | string[] | IFieldLogic[]
  ) {
    const { field } = this.state;

    field[attributeName] = value;

    this.setState({ field });
  }

  renderValidation() {
    const { field } = this.state;
    const type = field.type;

    if (type !== 'input' && type !== 'email' && type !== 'phone') {
      return null;
    }

    const validation = e =>
      this.onFieldChange(
        'validation',
        (e.currentTarget as HTMLInputElement).value
      );

    return (
      <FormGroup>
        <ControlLabel htmlFor="validation">Validation:</ControlLabel>

        <FormControl
          id="validation"
          componentClass="select"
          value={field.validation || ''}
          onChange={validation}
        >
          <option />
          <option value="email">{__('Email')}</option>
          <option value="number">{__('Number')}</option>
          <option value="datetime">{__('Date Time')}</option>
          <option value="date">{__('Date')}</option>
          <option value="phone">{__('Phone')}</option>
        </FormControl>
      </FormGroup>
    );
  }

  renderOptions() {
    const { field } = this.state;

    const onChange = e =>
      this.onFieldChange(
        'options',
        (e.currentTarget as HTMLInputElement).value.split('\n')
      );

    if (!['select', 'check', 'radio'].includes(field.type)) {
      return null;
    }

    return (
      <FormGroup>
        <ControlLabel htmlFor="type">Options:</ControlLabel>

        <FormControl
          id="options"
          componentClass="textarea"
          value={(field.options || []).join('\n')}
          onChange={onChange}
        />
      </FormGroup>
    );
  }

  renderExtraButton() {
    const { mode, field } = this.props;

    if (mode === 'create') {
      return null;
    }

    const onDelete = e => {
      e.preventDefault();

      this.props.onDelete(field);
    };

    return (
      <Button
        uppercase={false}
        btnStyle="danger"
        onClick={onDelete}
        icon="minus-circle-1"
      >
        Delete
      </Button>
    );
  }

  renderLeftContent() {
    const { fields, mode, onCancel } = this.props;
    const { field } = this.state;

    const text = e =>
      this.onFieldChange('text', (e.currentTarget as HTMLInputElement).value);

    const groupName = e =>
      this.onFieldChange(
        'groupName',
        (e.currentTarget as HTMLInputElement).value
      );

    const desc = e =>
      this.onFieldChange(
        'description',
        (e.currentTarget as HTMLInputElement).value
      );

    const toggle = e =>
      this.onFieldChange(
        'isRequired',
        (e.currentTarget as HTMLInputElement).checked
      );

    return (
      <>
        <CollapseContent
          title={__('General settings')}
          compact={true}
          open={true}
        >
          <FormGroup>
            <ControlLabel htmlFor="text" required={false}>
              Group Name
            </ControlLabel>

            <FormControl
              id="GroupName"
              type="text"
              value={field.groupName || ''}
              onChange={groupName}
              autoFocus={false}
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel htmlFor="text" required={true}>
              Field Label
            </ControlLabel>

            <FormControl
              id="FieldLabel"
              type="text"
              value={field.text || ''}
              onChange={text}
              autoFocus={true}
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel htmlFor="description">Field description</ControlLabel>
            <FormControl
              id="FieldDescription"
              componentClass="textarea"
              value={field.description || ''}
              onChange={desc}
            />
          </FormGroup>

          {this.renderValidation()}

          {this.renderOptions()}

          <FormGroup>
            <FlexRow>
              <ControlLabel htmlFor="description">
                {__('Field is required')}
              </ControlLabel>
              <Toggle
                defaultChecked={field.isRequired || false}
                icons={{
                  checked: <span>Yes</span>,
                  unchecked: <span>No</span>
                }}
                onChange={toggle}
              />
            </FlexRow>
          </FormGroup>

          {this.renderCustomProperty()}
        </CollapseContent>
        {fields.length > 0 && (
          <CollapseContent title={__('Logic')} compact={true}>
            <FieldLogics
              fields={fields}
              currentField={field}
              onFieldChange={this.onFieldChange}
            />
          </CollapseContent>
        )}

        <Modal.Footer>
          <Button
            btnStyle="simple"
            uppercase={false}
            type="button"
            icon="times-circle"
            onClick={onCancel}
          >
            Cancel
          </Button>

          {this.renderExtraButton()}

          <Button
            uppercase={false}
            onClick={this.onSubmit}
            btnStyle="success"
            icon={mode === 'update' ? 'check-circle' : 'plus-circle'}
          >
            {mode === 'update' ? 'Save' : 'Add to Form'}
          </Button>
        </Modal.Footer>
      </>
    );
  }

  renderContent() {
    const { field } = this.state;

    return (
      <FlexItem>
        <LeftSection>{this.renderLeftContent()}</LeftSection>

        <PreviewSection>
          <Preview>
            <FieldPreview field={field} />

            <ShowPreview>
              <Icon icon="eye" /> Field preview
            </ShowPreview>
          </Preview>
        </PreviewSection>
      </FlexItem>
    );
  }

  renderCustomProperty() {
    const { type } = this.props;
    const { field, selectedOption } = this.state;

    if (['email', 'phone', 'firstName', 'lastName'].includes(field.type)) {
      return null;
    }

    return (
      <>
        <Divider>{__('Or')}</Divider>
        <FormGroup>
          <SelectProperty
            queryParams={{ type }}
            defaultValue={selectedOption && selectedOption.value}
            description="Any data collected through this field will copy to:"
            onChange={this.onPropertyChange}
          />
        </FormGroup>
      </>
    );
  }

  render() {
    const { mode, field, onCancel } = this.props;

    return (
      <Modal show={true} size="lg" onHide={onCancel} animation={false}>
        <Modal.Header closeButton={true}>
          <Modal.Title>
            {mode === 'create' ? 'Add' : 'Edit'} {field.type} field
          </Modal.Title>
        </Modal.Header>
        <Modal.Body id="ModalBody" className="md-padding">
          {this.renderContent()}
        </Modal.Body>
      </Modal>
    );
  }
}

export default FieldForm;
