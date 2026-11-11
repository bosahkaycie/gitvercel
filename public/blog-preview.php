<?php
/**
 * PIGL Dynamic Blog OpenGraph & Social Preview Router
 * Serves optimized OpenGraph (og:image, og:title, og:description) and Twitter Card tags
 * for social media crawlers (WhatsApp, Facebook, LinkedIn, Twitter/X, Telegram, Slack, iMessage)
 * and serves the full React application shell for human visitors.
 */

// 1. Extract post slug from query or URI
$slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';
if (empty($slug)) {
    $requestUri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
    if (preg_match('#^/blog/([^/]+)#', $requestUri, $matches)) {
        $slug = $matches[1];
    }
}
$slug = preg_replace('/[^a-zA-Z0-9_-]/', '', $slug);

// 2. Locate base index.html
$indexPath = __DIR__ . '/index.html';
if (!file_exists($indexPath)) {
    // If running in development or dist directory
    $distIndexPath = dirname(__DIR__) . '/dist/index.html';
    if (file_exists($distIndexPath)) {
        $indexPath = $distIndexPath;
    }
}

if (!file_exists($indexPath)) {
    http_response_code(404);
    echo "PIGL application shell not found.";
    exit();
}

$html = file_get_contents($indexPath);

// If no specific post slug requested (e.g. /blog), return standard index.html
if (empty($slug) || $slug === 'blog') {
    header('Content-Type: text/html; charset=UTF-8');
    echo $html;
    exit();
}

// 3. Fallback Post Definitions (in case Supabase is unreachable)
$fallbackPosts = [
    'pigl-at-nape-2026-continuing-industry-conversations' => [
        'title' => 'PIGL at NAPE 2026: Continuing Industry Conversations',
        'excerpt' => 'PIGL continued its participation at the 44th Annual International Conference and Exhibition of the Nigerian Association of Petroleum Explorationists (NAPE 2026), engaging industry professionals, organisations and stakeholders in discussions on engineering, technology and industry development.',
        'featured_image' => 'https://jbldpfvceacfonkzzhig.supabase.co/storage/v1/object/public/blog/1794348792224_DJI_20261110143132_0075_D.JPG',
        'slug' => 'pigl-at-nape-2026-continuing-industry-conversations',
        'author' => 'Dr. Chigozie Dimgba',
        'category' => 'Technical Updates',
        'published_at' => '2026-11-10T07:30:00+00:00'
    ],
    'high-precision-pipeline-route-survey-delta-corridor' => [
        'title' => 'High-Precision Pipeline Route Survey in Dense Niger Delta Mangrove Swamps',
        'excerpt' => 'Executing geodetic baseline control and dual-frequency GNSS bathymetric alignment for a 36-inch energy transmission corridor.',
        'featured_image' => 'https://polarisigl.com/og-image.jpg',
        'slug' => 'high-precision-pipeline-route-survey-delta-corridor',
        'author' => 'Engr. Steve Alabi, FNIS',
        'category' => 'Geosolutions & Engineering',
        'published_at' => '2026-10-24T08:00:00Z'
    ],
    'sub-bottom-geophysical-investigation-escravos' => [
        'title' => 'Sub-Bottom Geophysical Investigation for Offshore Platform Expansion in Escravos',
        'excerpt' => 'Deploying sub-bottom profilers and marine magnetometers to identify shallow gas hazards and seabed stratigraphy in the Gulf of Guinea.',
        'featured_image' => 'https://polarisigl.com/og-image.jpg',
        'slug' => 'sub-bottom-geophysical-investigation-escravos',
        'author' => 'Layefa Okoya',
        'category' => 'Metocean & Marine Solutions',
        'published_at' => '2026-10-15T09:30:00Z'
    ],
    '3d-laser-scanning-brownfield-gas-compression' => [
        'title' => 'High-Density 3D Laser Scanning & As-Built Digital Twin for Brownfield Gas Compression Station',
        'excerpt' => 'Achieving sub-millimeter reality capture to eliminate offshore tie-in clashes and accelerate engineering retrofit schedules.',
        'featured_image' => 'https://polarisigl.com/og-image.jpg',
        'slug' => '3d-laser-scanning-brownfield-gas-compression',
        'author' => 'Chigozie Dimgba',
        'category' => 'Industrial Solutions',
        'published_at' => '2026-09-28T14:15:00Z'
    ]
];

$post = null;

// 4. Check Fast Local Cache (TTL: 120 seconds)
$cacheDir = sys_get_temp_dir();
$cacheFile = $cacheDir . '/pigl_og_blog_' . md5($slug) . '.json';
if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < 120)) {
    $cached = @json_decode(file_get_contents($cacheFile), true);
    if (!empty($cached['title'])) {
        $post = $cached;
    }
}

// 5. Query Supabase REST API if not in cache
if (!$post) {
    $supabaseUrl = getenv('VITE_SUPABASE_URL') ?: 'https://jbldpfvceacfonkzzhig.supabase.co';
    $supabaseKey = getenv('SUPABASE_SERVICE_ROLE_KEY') ?: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpibGRwZnZjZWFjZm9ua3p6aGlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzcwNDQzOSwiZXhwIjoyMTA5MjgwNDM5fQ.-QdwJyGzzER_sLPqPCNIm3nSMYeJ1hHRCkBcFIN_NPk';
    $apiUrl = rtrim($supabaseUrl, '/') . '/rest/v1/blog_posts?slug=eq.' . urlencode($slug) . '&select=id,title,slug,excerpt,featured_image,author,category,tags,published_at,updated_at,seo_title,seo_description&limit=1';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 3);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 2);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . $supabaseKey,
        'Authorization: Bearer ' . $supabaseKey,
        'Accept: application/json'
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200 && !empty($response)) {
        $data = json_decode($response, true);
        if (is_array($data) && count($data) > 0) {
            $post = $data[0];
            @file_put_contents($cacheFile, json_encode($post));
        }
    }
}

// Fallback to static post registry if database query failed or returned empty
if (!$post && isset($fallbackPosts[$slug])) {
    $post = $fallbackPosts[$slug];
}

// If post could not be resolved, serve standard index.html
if (!$post) {
    header('Content-Type: text/html; charset=UTF-8');
    echo $html;
    exit();
}

// 6. Format Metadata Fields
$pageTitle = !empty($post['seo_title']) ? $post['seo_title'] : ($post['title'] . ' | PIGL Technical Insights');
$pageDesc = !empty($post['seo_description']) ? $post['seo_description'] : (!empty($post['excerpt']) ? $post['excerpt'] : 'Technical insights and engineering perspectives from Polaris Integrated & GeoSolutions Limited (PIGL).');
// Strip linebreaks and double quotes from meta description
$pageDesc = trim(preg_replace('/\s+/', ' ', strip_tags($pageDesc)));

// Resolve Featured Image to Absolute URL
$featuredImage = !empty($post['featured_image']) ? $post['featured_image'] : 'https://polarisigl.com/og-image.jpg?v=2';
if (strpos($featuredImage, 'http://') !== 0 && strpos($featuredImage, 'https://') !== 0) {
    $featuredImage = 'https://polarisigl.com' . (strpos($featuredImage, '/') === 0 ? '' : '/') . $featuredImage;
}

$pageUrl = 'https://polarisigl.com/blog/' . rawurlencode($post['slug']);
$author = !empty($post['author']) ? $post['author'] : 'Polaris Integrated & GeoSolutions Limited';
$category = !empty($post['category']) ? $post['category'] : 'Technical Insights';
$publishedTime = !empty($post['published_at']) ? $post['published_at'] : date('c');

// 7. Inject Meta Tags into HTML
// Title
$html = preg_replace('/<title>.*?<\/title>/is', '<title>' . htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') . '</title>', $html);

// Description
$html = preg_replace('/<meta\s+name=["\']description["\']\s+content=["\'].*?["\']/is', '<meta name="description" content="' . htmlspecialchars($pageDesc, ENT_QUOTES, 'UTF-8') . '"', $html);

// Canonical URL
$html = preg_replace('/<link\s+rel=["\']canonical["\']\s+href=["\'].*?["\']/is', '<link rel="canonical" href="' . htmlspecialchars($pageUrl, ENT_QUOTES, 'UTF-8') . '"', $html);

// Open Graph Core Tags
$html = preg_replace('/<meta\s+property=["\']og:type["\']\s+content=["\'].*?["\']/is', '<meta property="og:type" content="article"', $html);
$html = preg_replace('/<meta\s+property=["\']og:title["\']\s+content=["\'].*?["\']/is', '<meta property="og:title" content="' . htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') . '"', $html);
$html = preg_replace('/<meta\s+property=["\']og:description["\']\s+content=["\'].*?["\']/is', '<meta property="og:description" content="' . htmlspecialchars($pageDesc, ENT_QUOTES, 'UTF-8') . '"', $html);
$html = preg_replace('/<meta\s+property=["\']og:url["\']\s+content=["\'].*?["\']/is', '<meta property="og:url" content="' . htmlspecialchars($pageUrl, ENT_QUOTES, 'UTF-8') . '"', $html);

// Featured Image for Open Graph (Facebook, WhatsApp, LinkedIn, Telegram, etc.)
$html = preg_replace('/<meta\s+property=["\']og:image["\']\s+content=["\'].*?["\']/is', '<meta property="og:image" content="' . htmlspecialchars($featuredImage, ENT_QUOTES, 'UTF-8') . '"', $html);
$html = preg_replace('/<meta\s+property=["\']og:image:secure_url["\']\s+content=["\'].*?["\']/is', '<meta property="og:image:secure_url" content="' . htmlspecialchars($featuredImage, ENT_QUOTES, 'UTF-8') . '"', $html);
$html = preg_replace('/<meta\s+property=["\']og:image:alt["\']\s+content=["\'].*?["\']/is', '<meta property="og:image:alt" content="' . htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') . '"', $html);

// Twitter Card Tags
$html = preg_replace('/<meta\s+name=["\']twitter:card["\']\s+content=["\'].*?["\']/is', '<meta name="twitter:card" content="summary_large_image"', $html);
$html = preg_replace('/<meta\s+name=["\']twitter:title["\']\s+content=["\'].*?["\']/is', '<meta name="twitter:title" content="' . htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') . '"', $html);
$html = preg_replace('/<meta\s+name=["\']twitter:description["\']\s+content=["\'].*?["\']/is', '<meta name="twitter:description" content="' . htmlspecialchars($pageDesc, ENT_QUOTES, 'UTF-8') . '"', $html);
$html = preg_replace('/<meta\s+name=["\']twitter:url["\']\s+content=["\'].*?["\']/is', '<meta name="twitter:url" content="' . htmlspecialchars($pageUrl, ENT_QUOTES, 'UTF-8') . '"', $html);
$html = preg_replace('/<meta\s+name=["\']twitter:image["\']\s+content=["\'].*?["\']/is', '<meta name="twitter:image" content="' . htmlspecialchars($featuredImage, ENT_QUOTES, 'UTF-8') . '"', $html);
$html = preg_replace('/<meta\s+name=["\']twitter:image:alt["\']\s+content=["\'].*?["\']/is', '<meta name="twitter:image:alt" content="' . htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') . '"', $html);

// Article-Specific Meta Tags & Schema.org JSON-LD
$articleMeta = "\n  <!-- Article Specific OpenGraph Metadata -->" .
               "\n  <meta property=\"article:published_time\" content=\"" . htmlspecialchars($publishedTime, ENT_QUOTES, 'UTF-8') . "\">" .
               "\n  <meta property=\"article:author\" content=\"" . htmlspecialchars($author, ENT_QUOTES, 'UTF-8') . "\">" .
               "\n  <meta property=\"article:section\" content=\"" . htmlspecialchars($category, ENT_QUOTES, 'UTF-8') . "\">" .
               "\n  <meta name=\"author\" content=\"" . htmlspecialchars($author, ENT_QUOTES, 'UTF-8') . "\">";

// Structured JSON-LD Article Schema
$jsonLd = [
    '@context' => 'https://schema.org',
    '@type' => 'BlogPosting',
    'headline' => $pageTitle,
    'description' => $pageDesc,
    'image' => [$featuredImage],
    'datePublished' => $publishedTime,
    'dateModified' => !empty($post['updated_at']) ? $post['updated_at'] : $publishedTime,
    'author' => [
        '@type' => 'Person',
        'name' => $author
    ],
    'publisher' => [
        '@type' => 'Organization',
        'name' => 'Polaris Integrated & GeoSolutions Limited (PIGL)',
        'logo' => [
            '@type' => 'ImageObject',
            'url' => 'https://polarisigl.com/icon-512.png'
        ]
    ],
    'mainEntityOfPage' => [
        '@type' => 'WebPage',
        '@id' => $pageUrl
    ]
];
$jsonLdScript = "\n  <script type=\"application/ld+json\">\n" . json_encode($jsonLd, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n  </script>";

$html = str_replace('</head>', $articleMeta . $jsonLdScript . "\n</head>", $html);

// 8. Serve Response
header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: public, max-age=300, stale-while-revalidate=600');
echo $html;
exit();
