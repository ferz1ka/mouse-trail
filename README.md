# Canvas Mouse Trail Playground

A highly performant, visually dynamic interactive canvas playground that traces your mouse actions and generates a customizable particle system trail. 

Built beautifully from the ground up natively with **HTML5 Canvas**, **TypeScript**, and a sleek **Vanilla JS** dark mode control panel dock — entirely cleanly decoupled without relying on third-party layout libraries.

## Features

- **High-Performance Rendering**: Fluid, buttery-smooth animations generated directly onto an adaptive `<canvas>` object via `requestAnimationFrame`.
- **Customizable Physics Engine**: Track momentum effortlessly. The particles actively grab directional drag velocities straight from the coordinate deltas of your mouse cursor.
  - **Inheritance Trajectories**: Decide precisely how heavy the vacuum is with the *inherit factor* slider.
  - **Atmospheric Deceleration**: Fine-tune custom drag constants dictating friction to softly brake flying geometrical particles.
- **Deep Form Tinkering**: Out-of-the-box support for:
  - Switching particle rendering geometries (Circles, Stars, or Squares)
  - Randomized sizing interpolations
  - Custom base-colors or sweeping HSL "Rainbow Modes"
  - Variable spread logic
- **Adaptive Screen Splitting**: Utilizes a robust flex-box design matching responsive parent bounds on the window, ensuring the sidebar dock operates flawlessly beside your playground without forcing canvas overflow clipping.

## Installation & Setup

1. **Install Dependencies**
   Run the package manager from inside the root directory.
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm run dev
   ```

3. **Production Build**
   Generate a highly optimized, minified bundle spanning just a handful of kilobytes in weight.
   ```bash
   npm run build
   ```

## Folder Structure

- `src/core/`: Contains the overarching engine bounds, particle tracking maps, configurations, and drawing parameters.
- `src/ui/`: Contains the vanilla DOM node generators and dynamic UI hooks linked back to the physical configurations.
- `src/styles/`: Deep CSS token variables, dark-mode definitions, and structural layout directives.

## Tech Stack

- [Vite JS](https://vitejs.dev/) - Lightning-fast build tooling and hot-module replacement.
- **TypeScript** - Enforcing robust state rules on our interface.
- **Vanilla DOM API's** - Delivering clean, lightweight interfaces without loading React, Vue, or bulky UI dependencies. 
- **Vanilla CSS** - Unpolluted styling sheets natively utilizing CSS custom properties for sleek and fast token management.
