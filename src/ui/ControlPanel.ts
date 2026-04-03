import { config, defaultConfig } from '../core/Config';

export class ControlPanel {
  container: HTMLElement;

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) throw new Error(`Container #${containerId} not found`);
    this.container = container;

    this.render();
  }

  createGroup(title: string, controls: HTMLElement[]) {
    const group = document.createElement('div');
    group.className = 'control-group';
    
    const header = document.createElement('h3');
    header.textContent = title;
    group.appendChild(header);
    
    controls.forEach(ctrl => group.appendChild(ctrl));
    return group;
  }

  createSelect(label: string, key: keyof typeof config, options: string[]) {
    const wrapper = document.createElement('div');
    wrapper.className = 'control-row';
    
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    
    const select = document.createElement('select');
    options.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt;
      option.textContent = opt;
      select.appendChild(option);
    });
    
    select.value = config[key] as string;
    select.addEventListener('change', (e) => {
      (config as any)[key] = (e.target as HTMLSelectElement).value;
    });
    
    wrapper.appendChild(labelEl);
    wrapper.appendChild(select);
    return wrapper;
  }

  createRange(label: string, key: keyof typeof config, min: number, max: number, step: number) {
    const wrapper = document.createElement('div');
    wrapper.className = 'control-row';
    
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    
    const input = document.createElement('input');
    input.type = 'range';
    input.min = min.toString();
    input.max = max.toString();
    input.step = step.toString();
    input.value = config[key].toString();
    
    const valueEl = document.createElement('span');
    valueEl.className = 'value-display';
    valueEl.textContent = input.value;
    
    input.addEventListener('input', (e) => {
      const val = parseFloat((e.target as HTMLInputElement).value);
      (config as any)[key] = val;
      valueEl.textContent = val.toString();
    });
    
    wrapper.appendChild(labelEl);
    wrapper.appendChild(input);
    wrapper.appendChild(valueEl);
    return wrapper;
  }

  createCheckbox(label: string, key: keyof typeof config) {
    const wrapper = document.createElement('div');
    wrapper.className = 'control-row';
    
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = config[key] as boolean;
    
    input.addEventListener('change', (e) => {
      (config as any)[key] = (e.target as HTMLInputElement).checked;
    });
    
    wrapper.appendChild(labelEl);
    wrapper.appendChild(input);
    return wrapper;
  }

  createColor(label: string, key: keyof typeof config) {
    const wrapper = document.createElement('div');
    wrapper.className = 'control-row';
    
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    
    const input = document.createElement('input');
    input.type = 'color';
    input.value = config[key] as string;
    
    input.addEventListener('input', (e) => {
      (config as any)[key] = (e.target as HTMLInputElement).value;
    });
    
    wrapper.appendChild(labelEl);
    wrapper.appendChild(input);
    return wrapper;
  }

  render() {
    this.container.innerHTML = `
      <div class="panel-header">
        <h2>Mouse Trail Settings</h2>
        <button id="reset-btn" title="Reset to Defaults">🔄 Reset</button>
      </div>
    `;

    document.getElementById('reset-btn')?.addEventListener('click', () => {
      Object.assign(config, defaultConfig);
      this.render(); // Re-render to update inputs
    });
    
    const shapeControls = this.createGroup('Shape & Size', [
      this.createSelect('Shape', 'shape', ['Circle', 'Square', 'Star']),
      this.createRange('Size', 'size', 1, 100, 1),
      this.createCheckbox('Randomize Size', 'randomizeSize')
    ]);

    const colorControls = this.createGroup('Color', [
      this.createColor('Base Color', 'baseColor'),
      this.createCheckbox('Rainbow Mode', 'rainbowMode')
    ]);

    const physicsControls = this.createGroup('Physics & Behavior', [
      this.createRange('Fade Speed', 'delayFade', 0.001, 0.1, 0.001),
      this.createRange('Spread', 'spread', 0, 50, 1),
      this.createRange('Base Speed', 'speed', 0, 20, 0.1),
      this.createRange('Deceleration', 'deceleration', 0.8, 1.0, 0.01)
    ]);

    const spawnControls = this.createGroup('Spawning Rules', [
      this.createCheckbox('Idle Spawn', 'repetition'),
      this.createCheckbox('Inherit Velocity', 'inheritVelocity'),
      this.createRange('Inherit Factor', 'inheritFactor', 0.1, 2.0, 0.1)
    ]);

    this.container.appendChild(shapeControls);
    this.container.appendChild(colorControls);
    this.container.appendChild(physicsControls);
    this.container.appendChild(spawnControls);
  }
}
