export default function Header() {
  return (
    <header className="mb-12 text-center">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
        Roman Makarov
      </h1>
      <p className="mt-3 text-lg md:text-xl text-gray-600">
        CGI Artist | 3D Motion Designer | VFX & Product Animation
      </p>
      <div className="mt-8 max-w-3xl mx-auto text-left text-gray-700 space-y-4">
        <p>
          Hi! I’m Roman Makarov — a 3D artist and motion designer specializing in high-quality CGI content and product animation. I work at the intersection of 3D and video, blending digital objects, simulations, and effects seamlessly into live footage.
        </p>
        <p className="font-semibold">My main tools are Blender, Houdini, and After Effects.</p>
      </div>
    </header>
  );
}